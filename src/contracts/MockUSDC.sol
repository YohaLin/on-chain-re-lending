// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC (Mock 版)
 * @dev 這是 "玩具" USDC，用來在 Remix / 測試網 測試
 */
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        // 給部署者 10,000,000 顆 mUSDC (6位小數)
        _mint(msg.sender, 10_000_000 * 10**6); 
    }
}