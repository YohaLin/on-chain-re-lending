# 🚀 快速開始指南

## 問題診斷

你遇到「鑄造失敗」的原因很可能是：
**錢包連接到錯誤的鏈！**

- ❌ MetaMask 連接到: Ethereum Mainnet 或 Sepolia
- ✅ 智能合約部署在: **Sapphire (Chain ID: 23294)**

---

## ✅ 已修正的問題

### 1. 自動切換鏈功能
現在點擊「開始鑄造我的資產 NFT」時，系統會：
1. 檢查當前連接的鏈
2. 如果不是 Sapphire，**自動請求切換**
3. 顯示清楚的提示訊息

### 2. 視覺化提示
如果你連接到錯誤的鏈，頁面會顯示黃色警告：
```
⚠️ 需要切換網路
當前連接: Chain ID 1 (或 11155111)
需要切換到: Sapphire (Chain ID 23294)
```

---

## 📱 在 MetaMask 中添加 Sapphire 鏈

### 方法 1: 自動添加（推薦）
1. 到「託管完成」頁面
2. 點擊「開始鑄造我的資產 NFT」
3. MetaMask 會彈出「切換網路」請求
4. 如果沒有 Sapphire，會提示「添加網路」
5. 點擊「添加」

### 方法 2: 手動添加
如果自動添加失敗，請手動設定：

**在 MetaMask 中**:
1. 點擊右上角網路下拉選單
2. 點擊「新增網路」
3. 點擊「手動新增網路」
4. 填入以下資訊：

```
網路名稱: Sapphire
RPC URL: https://sapphire.oasis.io
Chain ID: 23294
符號: ROSE
區塊瀏覽器: https://explorer.oasis.io/mainnet/sapphire
```

5. 點擊「儲存」
6. 切換到 Sapphire 網路

---

## 🎯 完整測試流程

### 步驟 1: 啟動專案
```bash
cd /Users/mac/Desktop/on-chain-re-lending
yarn dev
```

### 步驟 2: 連接錢包
1. 打開 http://localhost:3000
2. 連接 MetaMask 或 ImToken
3. **確認連接到 Sapphire 鏈** ✨

### 步驟 3: 完成流程
1. 提交資產 → 審核 → 簽署合約 → 託管程序
2. 等待託管完成
3. 看到「實體託管完成！」頁面

### 步驟 4: 鑄造 NFT
1. **檢查頁面**:
   - 如果顯示黃色警告 → 你的錢包連接錯誤的鏈
   - 沒有警告 → 已經連接到 Sapphire ✅

2. **點擊「開始鑄造我的資產 NFT」**

3. **如果出現切換網路請求**:
   - MetaMask 會彈出視窗
   - 點擊「切換網路」
   - 如果沒有 Sapphire，點擊「添加網路」

4. **等待鑄造**:
   - ✅ 檢查網路連接
   - ⏳ 上傳資料到 IPFS
   - ⏳ 呼叫智能合約
   - ⏳ 等待交易確認

5. **成功！**:
   - 🎉 NFT 鑄造成功！
   - 顯示 Token ID

---

## 🔍 Debug 檢查清單

如果還是失敗，按照以下步驟檢查：

### ✅ 檢查 1: 錢包連接的鏈
```javascript
// 打開瀏覽器 Console (F12)
// 查看當前鏈 ID
console.log("當前鏈:", window.ethereum.chainId);
// 應該返回 "0x5afe" (23294 的十六進制)
```

### ✅ 檢查 2: 合約地址
```javascript
// 確認合約地址正確
console.log("合約地址:", "0x077EA4EEB46Fdf1F406E108e52fd463764d73383");
```

### ✅ 檢查 3: 錢包餘額
確保錢包有 ROSE (Sapphire 的原生代幣) 用於支付 Gas

### ✅ 檢查 4: 錢包權限
確認你的錢包是合約的 Owner (有權呼叫 `adminMint`)

---

## 💡 常見錯誤及解決方案

### 錯誤 1: "無法自動切換到 Sapphire 鏈"
**原因**: MetaMask 沒有 Sapphire 網路配置
**解決**: 手動添加 Sapphire 網路（參考上方步驟）

### 錯誤 2: "execution reverted: Ownable: caller is not the owner"
**原因**: 你的錢包不是合約 Owner
**解決**:
- 聯繫合約 Owner
- 或使用 Owner 錢包來鑄造

### 錯誤 3: "insufficient funds"
**原因**: 錢包沒有足夠的 ROSE
**解決**:
- 從交易所購買 ROSE
- 或使用測試網 faucet

### 錯誤 4: "User rejected"
**原因**: 你在錢包中取消了交易
**解決**: 重新點擊按鈕並在錢包中確認

---

## 📊 測試網選項 (推薦用於測試)

如果你想先在測試網測試，修改以下配置：

### 1. 修改 `src/utils/propertyNFT.ts`:
```typescript
// 從
export const SAPPHIRE_CHAIN_ID = 23294; // Mainnet

// 改成
export const SAPPHIRE_CHAIN_ID = 23295; // Testnet
```

### 2. 在 MetaMask 添加 Sapphire 測試網:
```
網路名稱: Sapphire Testnet
RPC URL: https://testnet.sapphire.oasis.io
Chain ID: 23295
符號: TEST
區塊瀏覽器: https://explorer.oasis.io/testnet/sapphire
```

### 3. 從 Faucet 獲取測試幣
- 前往 Oasis Faucet
- 輸入你的錢包地址
- 獲取免費測試幣

---

## 🎉 成功的標誌

當一切正常時，你會看到：

1. **託管完成頁面**:
   - ✅ 沒有黃色警告（或警告顯示已連接到 Sapphire）
   - 「開始鑄造我的資產 NFT」按鈕可點擊

2. **點擊後**:
   - Toast 通知: "檢查網路連接"
   - Toast 通知: "正在上傳資料到 IPFS"
   - Toast 通知: "正在鑄造 NFT"
   - MetaMask 彈出交易確認

3. **交易確認後**:
   - Toast 通知: "🎉 NFT 鑄造成功！Token ID: 1"
   - 自動跳轉到 NFT 預覽頁面

4. **Console 輸出**:
   ```
   當前鏈 ID: 23294
   目標鏈 ID: 23294
   IPFS URI: ipfs://QmMock... (或真實 CID)
   交易已發送: 0x...
   交易已確認: {...}
   ```

---

## 📞 還是失敗？

請提供以下資訊：

1. **Console 完整錯誤訊息**
2. **當前連接的鏈 ID** (在 Console 輸入 `window.ethereum.chainId`)
3. **你的錢包地址**
4. **MetaMask 是否有 Sapphire 網路？**
5. **點擊按鈕後發生什麼？**

把這些資訊告訴我，我會幫你診斷問題！

---

最後更新: 2025-10-31
