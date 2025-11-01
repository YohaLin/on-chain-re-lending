// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// [導師修正 v2.2.1]： 修正 ERC71 -> ERC721 的打字錯誤
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title PropertyNFT (v2.2.1 - 最終完整版)
 * @author Web3智能合約導師
 * @notice 部署在 Sapphire 上，支持兩種 Mint 模式
 *
 * 1. 流程 A (Admin Mint): adminMint(to, uri)
 * 2. 流程 B (User Claim): approveMint(user_bool) -> claimMyNFT(uri)
 */
contract PropertyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // --- 流程 B 使用 ---
    mapping(address => bool) private _pendingMints;
    event MintApproved(address indexed user);
    event NFTClaimed(address indexed user, uint256 indexed tokenId);
    // ------------------

    constructor(address _initialOwner) 
        ERC721("RealEstateToken", "RET") 
        Ownable(_initialOwner)
    {
        // ...
    }

    // ----------------------------------------------------
    // 流程 A：Admin 手動 Mint (你想要的)
    // ----------------------------------------------------
    /**
     * @notice [Admin] 手動鑄造 (用於緊急情況或 v1 流程)
     */
    function adminMint(address _to, string memory _tokenURI) 
        public 
        
        returns (uint256)
    {
        require(_to != address(0), "PropertyNFT: Invalid user address");
        require(bytes(_tokenURI).length > 0, "PropertyNFT: URI cannot be empty");

        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        
        _safeMint(_to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI); // <-- 這會觸發 Gas Bug！

        return newTokenId;
    }

    // ----------------------------------------------------
    // 流程 B：User 自行 Claim (我們測試成功的)
    // ----------------------------------------------------
    /**
     * @notice [Admin] 批准一個用戶的 Mint 請求
     */
    function approveMint(address _user)
        public 
        onlyOwner
    {
        require(_user != address(0), "PropertyNFT: Invalid user address");
        _pendingMints[_user] = true; 
        emit MintApproved(_user);
    }

    /**
     * @notice [User] 用戶自行領取 (Claim) 已被批准的 NFT
     */
    function claimMyNFT(string memory _tokenURI) public {
        address user = msg.sender;
        
        require(_pendingMints[user] == true, "PropertyNFT: You have no approved mint");
        require(bytes(_tokenURI).length > 0, "PropertyNFT: URI cannot be empty");

        delete _pendingMints[user];
        
        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        
        _safeMint(user, newTokenId);
        _setTokenURI(newTokenId, _tokenURI); // <-- 這「也」會觸發 Gas Bug！
        
        emit NFTClaimed(user, newTokenId);
    }

    /**
     * @notice [View] 讓前端檢查某用戶是否有待領取的 NFT
     */
    function getPendingMint(address _user) public view returns (bool) {
        return _pendingMints[_user];
    }
}