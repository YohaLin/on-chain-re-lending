# PropertyNFT 智能合約串接指南

## 📋 功能概述

本專案已完成與 Sapphire 鏈上的 PropertyNFT 智能合約的串接,實現了在使用者完成「數位簽名」步驟後自動鑄造 NFT 的功能。

**合約地址**: `0x077EA4EEB46Fdf1F406E108e52fd463764d73383` (Sapphire Mainnet)

## 🔧 實作內容

### 1. IPFS 上傳工具 (`src/utils/ipfs.ts`)

處理 NFT metadata 上傳到 IPFS:

- `uploadMetadataToIPFS()`: 上傳 JSON metadata
- `uploadImageToIPFS()`: 上傳圖片檔案
- `ipfsToHttp()`: 將 IPFS URI 轉換為 HTTP gateway URL

**特性**:
- 支援 Pinata 服務
- 未設定 API keys 時自動生成 mock URI (用於測試)

### 2. 智能合約互動工具 (`src/utils/propertyNFT.ts`)

處理與 PropertyNFT 合約的互動:

- `adminMintNFT()`: Admin 鑄造 NFT
- `getSapphireExplorerUrl()`: 生成區塊鏈瀏覽器連結
- `formatTransactionHash()`: 格式化交易 hash

### 3. 數位簽名對話框 (`src/components/DigitalSignatureDialog.tsx`)

整合 NFT 鑄造流程:

**流程**:
1. 使用者完成數位簽名
2. 構建 NFT metadata
3. 上傳 metadata 到 IPFS → 獲得 `tokenURI`
4. 呼叫 `adminMint(userAddress, tokenURI)`
5. 等待交易確認
6. 返回 `tokenId` 和 `transactionHash`

**Props**:
```typescript
{
  userAddress: `0x${string}` | undefined;  // 從 imToken 獲得的地址
  assetData: {
    name: string;           // 資產名稱
    description: string;    // 資產描述
    address: string;        // 資產地址
    assetType: string;      // 資產類型
  };
  onConfirm: (result: {
    tokenId?: bigint;
    transactionHash?: string
  }) => void;
}
```

## 🚀 設定步驟

### 1. 安裝依賴

專案已包含所需依賴 (`wagmi`, `viem`, `@web3modal/wagmi`):

```bash
yarn install
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env.local`:

```bash
cp .env.example .env.local
```

編輯 `.env.local`:

```env
# WalletConnect Project ID (必須)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Pinata IPFS API Keys (可選,未設定會使用 mock URI)
NEXT_PUBLIC_PINATA_API_KEY=your_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_secret_key
```

**獲取 API Keys**:
- WalletConnect: https://cloud.walletconnect.com
- Pinata: https://app.pinata.cloud

### 3. 配置 Sapphire 鏈

確認 [src/utils/propertyNFT.ts](src/utils/propertyNFT.ts#L13) 中的鏈 ID 正確:

```typescript
export const SAPPHIRE_CHAIN_ID = 23294; // Mainnet
// 測試網: 23295
```

如果使用測試網,記得也要在 [src/config/web3modal.ts](src/config/web3modal.ts#L49) 中添加 Sapphire 測試網鏈配置。

## 📝 使用說明

### 完整流程

1. **使用者連接錢包 (imToken)**
   - 在首頁點擊「ImToken」
   - 完成 WalletConnect 連接
   - 系統獲得 `userAddress`

2. **提交資產資訊**
   - 填寫資產名稱、描述、地址
   - 上傳證明文件
   - 系統暫存 `assetData`

3. **完成 KYC 驗證**
   - 上傳身份證明
   - 等待審核通過

4. **數位簽名並鑄造 NFT**
   - 點擊「接受」進入合約審查
   - 確認合約條款
   - 完成數位簽名
   - **自動觸發 NFT 鑄造**:
     - ✅ 上傳 metadata 到 IPFS
     - ✅ 呼叫 `adminMint(userAddress, tokenURI)`
     - ✅ 等待交易確認
     - ✅ 顯示 Token ID

### adminMint 參數說明

```solidity
function adminMint(address _to, string memory _tokenURI)
    public
    onlyOwner
    returns (uint256)
```

**參數**:
1. `_to` (address): 接收者地址
   - 來源: 從 `useAccount()` hook 獲取的 `address`
   - 這是使用者透過 imToken 連接的錢包地址

2. `_tokenURI` (string): IPFS URI
   - 格式: `ipfs://Qm...`
   - 來源: 上傳 metadata JSON 到 IPFS 後獲得
   - 內容結構:
     ```json
     {
       "name": "台北市信義區豪宅",
       "description": "房地產 - 120 坪",
       "attributes": [
         { "trait_type": "Asset Type", "value": "房地產" },
         { "trait_type": "Location", "value": "台北市信義區..." }
       ],
       "properties": {
         "address": "台北市信義區基隆路一段 200 號",
         "assetType": "房地產",
         "mintedAt": "2025-10-31T..."
       }
     }
     ```

## 🔍 測試建議

### 開發階段測試

1. **不設定 Pinata keys** (使用 mock URI):
   ```env
   # .env.local 中不設定或註解掉
   # NEXT_PUBLIC_PINATA_API_KEY=
   # NEXT_PUBLIC_PINATA_SECRET_KEY=
   ```
   - 系統會自動生成 mock URI: `ipfs://QmMock...`
   - 可以測試完整流程,不需要真的上傳到 IPFS

2. **使用 Sapphire 測試網**:
   - 修改 `SAPPHIRE_CHAIN_ID` 為 `23295`
   - 從測試網 faucet 獲取測試幣
   - 降低開發成本

### 生產環境

1. **設定真實的 Pinata keys**
2. **使用 Sapphire 主網**
3. **確保 Admin 錢包有足夠的 Gas**

## 🐛 錯誤處理

程式碼已包含完整的錯誤處理:

```typescript
// 使用者取消交易
if (error.message?.includes("User rejected")) {
  errorMessage = "使用者取消了交易";
}

// 餘額不足
if (error.message?.includes("insufficient funds")) {
  errorMessage = "餘額不足,請確保有足夠的 Gas 費用";
}
```

使用者會在 UI 上看到清晰的錯誤訊息。

## 📊 查看交易記錄

鑄造成功後,可以透過以下方式查看:

1. **區塊鏈瀏覽器**:
   ```typescript
   const explorerUrl = getSapphireExplorerUrl(transactionHash, "tx");
   // https://explorer.oasis.io/mainnet/sapphire/tx/0x...
   ```

2. **Token ID**:
   - 從交易 receipt 的 Transfer 事件中解析
   - 顯示在成功訊息中

## 🎯 下一步

完成 NFT 鑄造後,系統會:

1. 顯示成功訊息 (含 Token ID)
2. 進入「實體託管流程」
3. 使用者可以在「我的資產」中查看 NFT

## 💡 技術細節

### 為什麼使用動態導入?

```typescript
const { uploadMetadataToIPFS } = await import("@/utils/ipfs");
const { adminMintNFT } = await import("@/utils/propertyNFT");
```

- 避免 Next.js SSR 問題
- 減少初始 bundle 大小
- 只在需要時載入

### 為什麼需要 Admin 權限?

```solidity
function adminMint(...) public onlyOwner
```

- `adminMint` 只能由合約 owner 呼叫
- 確保前端使用的是 Admin 錢包簽署交易
- 如果使用普通使用者錢包會失敗

## 📞 支援

如有問題,請檢查:
1. Console 錯誤訊息
2. 錢包是否正確連接
3. 環境變數是否正確設定
4. 鏈 ID 是否匹配

---

**最後更新**: 2025-10-31
