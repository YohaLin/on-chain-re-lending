// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============ Imports ============
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// ============ Interfaces ============

/**
 * @title IManualPriceOracle (Mock 介面)
 * @dev 這是 "Mock" 版的介面，匹配 ManualPriceOracle.sol
 */
interface IManualPriceOracle {
    function getAssetPrice(address nftAddress, uint256 tokenId) 
        external 
        view 
        returns (uint256);
}

/**
 * @title LendingPool (Mock 版)
 * @dev 這是 100% 可在 Remix 部署和測試的 Mock 版本
 */
contract LendingPool_Mock is ReentrancyGuard, Ownable {

    // ============ State Variables ============
    IERC721 public immutable propertyNFT;
    IManualPriceOracle public immutable oracle; // <--- 使用 Mock 介面
    IERC20 public immutable stablecoin;

    // ... (所有 LTV, 利率, Loan struct, Events... 都跟之前一樣) ...
    uint256 public constant BASIS_POINTS_DENOMINATOR = 10000;
    uint256 public constant LTV_BASIS_POINTS = 7000; 
    uint256 public constant LIQUIDATION_LTV_BASIS_POINTS = 8500;
    uint256 public constant SECONDS_PER_YEAR = 365 days; 
    uint256 public annualInterestRateBasisPoints; 

    struct Loan {
        address borrower;
        uint256 principal;
        uint256 startTime;
    }
    mapping(uint256 => Loan) public loans;
    
    event Borrowed(uint256 indexed tokenId, address indexed borrower, uint256 amount);
    event Repaid(uint256 indexed tokenId, address indexed payer, uint256 amountPaid, uint256 interestPaid);
    event Liquidated(uint256 indexed tokenId, address indexed borrower, address indexed liquidator, uint256 debtRepaid);
    event InterestRateUpdated(uint256 newRate);


    // ============ Constructor ============
    constructor(
        address _nftAddress,
        address _oracleAddress, // 這個地址是 ManualPriceOracle 的地址
        address _stablecoinAddress
    ) Ownable(msg.sender) {
        propertyNFT = IERC721(_nftAddress);
        oracle = IManualPriceOracle(_oracleAddress); // <--- 使用 Mock 介面
        stablecoin = IERC20(_stablecoinAddress);
        annualInterestRateBasisPoints = 250; 
        emit InterestRateUpdated(250);
    }

    // ============ Core Logic Functions (Borrow, Repay, Liquidate) ============
    // ...
    // (這裡的程式碼跟我們 Code Review 過的 "最終完整版" 完全一樣)
    // (你不需要修改任何東西，因為它們依賴的 view 函數是正確的)
    // ...
    function depositNFTAndBorrow(uint256 _tokenId, uint256 _borrowAmount) 
        public 
        nonReentrant 
    {
        require(_borrowAmount > 0, "Borrow amount must be positive");
        Loan storage loan = loans[_tokenId];
        require(loan.borrower == address(0), "Loan already active for this NFT");
        uint256 maxBorrowable = getBorrowableAmount(_tokenId);
        require(_borrowAmount <= maxBorrowable, "Borrow amount exceeds LTV limit");
        loan.borrower = msg.sender;
        loan.principal = _borrowAmount;
        loan.startTime = block.timestamp;
        propertyNFT.safeTransferFrom(msg.sender, address(this), _tokenId);
        stablecoin.transfer(msg.sender, _borrowAmount);
        emit Borrowed(_tokenId, msg.sender, _borrowAmount);
    }

    function repay(uint256 _tokenId) 
        public 
        nonReentrant 
    {
        Loan storage loan = loans[_tokenId];
        require(loan.borrower != address(0), "No active loan found for this NFT");
        require(msg.sender == loan.borrower, "Only the borrower can repay");
        (uint256 principal, uint256 interest) = calculateCurrentDebt(_tokenId);
        uint256 totalDebt = principal + interest;
        require(totalDebt > 0, "No debt to repay");
        stablecoin.transferFrom(msg.sender, address(this), totalDebt);
        delete loans[_tokenId];
        propertyNFT.safeTransferFrom(address(this), msg.sender, _tokenId);
        emit Repaid(_tokenId, msg.sender, principal, interest);
    }

    function liquidate(uint256 _tokenId) 
        public 
        nonReentrant 
    {
        require(checkLiquidationEligibility(_tokenId), "Loan is not eligible for liquidation");
        Loan storage loan = loans[_tokenId];
        address borrower = loan.borrower;
        (uint256 principal, uint256 interest) = calculateCurrentDebt(_tokenId);
        uint256 totalDebt = principal + interest;
        stablecoin.transferFrom(msg.sender, address(this), totalDebt);
        delete loans[_tokenId];
        propertyNFT.safeTransferFrom(address(this), msg.sender, _tokenId);
        emit Liquidated(_tokenId, borrower, msg.sender, totalDebt);
    }

    // ============ View / Helper Functions (Mock 版) ============

    function getBorrowableAmount(uint256 _tokenId) 
        public 
        view 
        returns (uint256) 
    {
        // <--- 使用 Mock 介面的 getAssetPrice
        uint256 assetPrice = oracle.getAssetPrice(address(propertyNFT), _tokenId); 
        uint256 borrowableAmount = (assetPrice * LTV_BASIS_POINTS) / BASIS_POINTS_DENOMINATOR;
        return borrowableAmount;
    }

    function calculateCurrentDebt(uint256 _tokenId) 
        public 
        view 
        returns (uint256 principal, uint256 interest) 
    {
        Loan storage loan = loans[_tokenId];
        if (loan.borrower == address(0)) { return (0, 0); }
        principal = loan.principal;
        uint256 timeElapsed = block.timestamp - loan.startTime;
        interest = (principal * annualInterestRateBasisPoints * timeElapsed) 
                    / (BASIS_POINTS_DENOMINATOR * SECONDS_PER_YEAR);
        return (principal, interest);
    }

    function checkLiquidationEligibility(uint256 _tokenId) 
        public 
        view 
        returns (bool) 
    {
        Loan storage loan = loans[_tokenId];
        if (loan.borrower == address(0)) { return false; }
        (uint256 principal, uint256 interest) = calculateCurrentDebt(_tokenId);
        uint256 totalDebt = principal + interest;
        if (totalDebt == 0) { return false; }
        // <--- 使用 Mock 介面的 getAssetPrice
        uint256 assetPrice = oracle.getAssetPrice(address(propertyNFT), _tokenId);
        uint256 liquidationValueThreshold = (assetPrice * LIQUIDATION_LTV_BASIS_POINTS) / BASIS_POINTS_DENOMINATOR;
        return totalDebt > liquidationValueThreshold;
    }
}