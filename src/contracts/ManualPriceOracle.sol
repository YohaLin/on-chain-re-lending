// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ManualPriceOracle (Mock 版)
 * @dev (黑客松專用) 手動更新 RWA 價格的預言機。
 */
contract ManualPriceOracle is Ownable {
    
    mapping(address => mapping(uint256 => uint256)) private _assetPrices;

    event PriceUpdated(address indexed nftAddress, uint256 indexed tokenId, uint256 newPrice);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev (Owner) 更新 RWA (NFT) 的價格
     * @param price 價格 (傳入 6 位小數, 例如 $500,000 -> 500000 * 10**6)
     */
    function setAssetPrice(address nftAddress, uint256 tokenId, uint256 price) 
        public 
        onlyOwner 
    {
        _assetPrices[nftAddress][tokenId] = price;
        emit PriceUpdated(nftAddress, tokenId, price);
    }

    /**
     * @dev 獲取 RWA (NFT) 的價格
     */
    function getAssetPrice(address nftAddress, uint256 tokenId) 
        public 
        view 
        returns (uint256) 
    {
        uint256 price = _assetPrices[nftAddress][tokenId];
        require(price > 0, "Price not set for this asset");
        return price;
    }
}