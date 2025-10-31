# NFT 鑄造 - 錯誤排除指南

## 🔧 已修正的問題

### 1. ✅ Sapphire 鏈配置缺失
**問題**: wagmi config 中沒有 Sapphire 鏈，導致無法連接
**解決**: 已在 [src/config/web3modal.ts](src/config/web3modal.ts) 中添加 Sapphire 鏈配置

```typescript
// 現在支援的鏈
const chains = [mainnet, sepolia, sapphire, sapphireTestnet];
```

### 2. ✅ NFT 鑄造時機錯誤
**問題**: 原本在「簽名步驟」鑄造，但應該在「託管完成後」鑄造
**解決**: 已將鑄造邏輯移到 [CustodyProcess.tsx](src/components/CustodyProcess.tsx)

**新流程**:
```
步驟 0: 資產提交
步驟 1: 審核中
步驟 2: 託管程序 → [完成託管] → [點擊按鈕鑄造 NFT] ✨
步驟 3: NFT 預覽 (顯示鑄造結果)
步驟 4: 成功頁面
```

---

## 🚨 常見錯誤及解決方案

### 錯誤 1: "鑄造失敗" (沒有詳細錯誤訊息)

#### 可能原因 A: 錢包未連接到 Sapphire 鏈
**症狀**: 錢包連接成功，但交易失敗
**檢查**:
```bash
# 打開瀏覽器 Console (F12)
# 查看錢包連接的鏈 ID
console.log(chain.id); // 應該是 23294 (Sapphire Mainnet)
```

**解決**:
1. 手動切換鏈：在 imToken 中切換到 Sapphire 鏈
2. 或在程式碼中加入自動切換：

```typescript
// 在 handleMintNFT 前檢查鏈
import { useSwitchChain } from 'wagmi';

const { switchChain } = useSwitchChain();

// 檢查並切換鏈
if (chain?.id !== 23294) {
  await switchChain({ chainId: 23294 });
}
```

#### 可能原因 B: 錢包不是合約 Owner
**症狀**: 錯誤訊息包含 "Ownable: caller is not the owner"
**問題**: `adminMint` 只能由合約 owner 呼叫

**解決**:
1. 確認你的錢包地址是合約 owner
2. 在 Sapphire Explorer 查看合約: https://explorer.oasis.io/mainnet/sapphire/address/0x077EA4EEB46Fdf1F406E108e52fd463764d73383
3. 如果不是 owner，需要：
   - 用 owner 錢包連接
   - 或請 owner 轉移所有權給你

#### 可能原因 C: Gas 費不足
**症狀**: 錯誤訊息包含 "insufficient funds"
**解決**:
1. 確保錢包有足夠的 ROSE (Sapphire 原生代幣)
2. 從交易所或 faucet 獲取 ROSE

#### 可能原因 D: IPFS 上傳失敗
**症狀**: 顯示 "上傳到 IPFS 失敗"
**檢查**:
```bash
# 查看 .env.local
cat .env.local | grep PINATA
```

**解決**:
1. **測試階段**: 不要設定 Pinata keys (會使用 mock URI)
2. **生產階段**: 設定正確的 Pinata keys

---

## ✅ 測試前檢查清單

執行以下命令進行自我檢查：

```bash
# 1. 檢查環境變數
cat .env.local

# 應該包含：
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=xxx
# (Pinata keys 可選)

# 2. 檢查依賴安裝
yarn install

# 3. 啟動開發伺服器
yarn dev
```

### 連接錢包檢查

- [ ] ImToken 已安裝並登入
- [ ] WalletConnect 連接成功
- [ ] 可以看到錢包地址顯示在頁面上
- [ ] 錢包連接到 Sapphire 鏈 (chain ID: 23294)

### 鑄造前檢查

- [ ] 已完成「託管程序」步驟
- [ ] 看到「開始鑄造我的資產 NFT」按鈕
- [ ] 錢包有足夠的 ROSE (用於 Gas)
- [ ] 確認使用的是合約 Owner 錢包

### 鑄造過程檢查

- [ ] 點擊按鈕後顯示「正在上傳資料到 IPFS」
- [ ] 顯示「正在鑄造 NFT」
- [ ] 錢包彈出交易確認視窗
- [ ] 在錢包中確認交易
- [ ] 等待交易確認 (約 10-30 秒)
- [ ] 看到「NFT 鑄造成功」訊息

---

## 🔍 Debug 步驟

如果遇到錯誤，請按以下步驟 debug：

### 步驟 1: 開啟 Console
```bash
# 瀏覽器按 F12
# 切換到 Console 標籤
```

### 步驟 2: 查看錯誤訊息
```javascript
// 應該會看到類似：
// "鑄造 NFT 錯誤: Error: ..."
```

### 步驟 3: 檢查網路請求
```bash
# 在 Console 輸入：
console.log("Wallet Address:", address);
console.log("Chain ID:", chain?.id);
```

### 步驟 4: 測試 IPFS 上傳
```javascript
// 在 Console 測試：
const { uploadMetadataToIPFS } = await import("/src/utils/ipfs.ts");
const uri = await uploadMetadataToIPFS({
  name: "Test",
  description: "Test NFT"
});
console.log("IPFS URI:", uri);
```

---

## 📞 需要幫助？

### 收集以下資訊：

1. **錯誤訊息**: 從 Console 複製完整錯誤
2. **錢包地址**: 你連接的錢包地址
3. **鏈 ID**: 當前連接的鏈
4. **環境**: 開發/生產
5. **步驟**: 在哪個步驟出錯

### 常用 Console 命令：

```javascript
// 檢查錢包連接
console.log("Address:", address);
console.log("Chain:", chain);
console.log("Connected:", isConnected);

// 檢查合約配置
import { PROPERTY_NFT_ADDRESS, SAPPHIRE_CHAIN_ID } from "@/utils/propertyNFT";
console.log("Contract:", PROPERTY_NFT_ADDRESS);
console.log("Chain ID:", SAPPHIRE_CHAIN_ID);

// 測試環境變數
console.log("Has Pinata Keys:", !!process.env.NEXT_PUBLIC_PINATA_API_KEY);
```

---

## 🎯 快速測試方案

### 最小化測試 (不需要 Pinata)

1. **不要設定 Pinata keys**
2. 確保 `.env.local` 有 WalletConnect ID
3. 執行 `yarn dev`
4. 完整走完流程
5. 到「託管完成」頁面
6. 點擊「開始鑄造我的資產 NFT」
7. **預期**: 使用 mock URI 成功鑄造

### 真實測試 (使用真實 IPFS)

1. 註冊 Pinata
2. 設定 API keys 到 `.env.local`
3. 重啟開發伺服器
4. 重複上述流程
5. **預期**: 使用真實 IPFS URI 成功鑄造
6. 可以在 `https://gateway.pinata.cloud/ipfs/Qm...` 查看 metadata

---

## ⚠️ 重要提醒

### Admin 權限問題

如果你看到這個錯誤：
```
Error: execution reverted: Ownable: caller is not the owner
```

**這表示你的錢包不是合約 owner。**

**解決方案**:
1. 聯繫合約 owner
2. 請 owner 執行：
   ```solidity
   // 在合約中呼叫
   transferOwnership(你的錢包地址);
   ```
3. 或使用 owner 的錢包來鑄造 NFT

### Sapphire 鏈切換

如果錢包沒有 Sapphire 鏈，需要手動添加：

**網路配置**:
- 網路名稱: Sapphire
- RPC URL: https://sapphire.oasis.io
- Chain ID: 23294
- 符號: ROSE
- 區塊瀏覽器: https://explorer.oasis.io/mainnet/sapphire

---

最後更新: 2025-10-31
