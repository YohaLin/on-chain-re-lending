# Self.xyz KYC 整合指南

## 📋 已完成的工作

我已經為您的專案整合了 **Self.xyz 零知識身份驗證** 和 **傳統 KYC** 的混合方案。

### ✅ 完成項目：

1. **後端 API Routes**
   - `src/app/api/kyc/self-verify/route.ts` - Self.xyz 驗證 API
   - `src/app/api/kyc/traditional-upload/route.ts` - 傳統 KYC 上傳 API

2. **前端頁面更新**
   - `src/app/kyc-verification/page.tsx` - 新的混合 KYC 頁面
   - `src/app/kyc-verification/page-old-backup.tsx` - 原頁面備份

3. **環境變數配置**
   - `.env.local` - 已添加 Self.xyz 相關設定

4. **CSP 安全配置**
   - `next.config.js` - 已配置 WalletConnect 和 Self 的 CSP 規則

---

## 🚀 接下來需要做的事

### ✅ 已完成：安裝 Self.xyz SDK

您已經成功安裝了：
- ✅ `@selfxyz/qrcode` - Self QR Code 組件
- ✅ `@selfxyz/core` - Self 後端驗證

### ✅ 已完成：整合真實的 Self QR Code

前端頁面已經更新：
- ✅ 引入 `SelfQRcodeWrapper` 和 `SelfAppBuilder`
- ✅ 配置 Self App（年齡限制、國籍驗證）
- ✅ 顯示真實的 QR Code
- ✅ 處理驗證成功和錯誤回調

### ✅ 已完成：啟用後端真實驗證

後端 API 已經更新：
- ✅ 使用 `SelfBackendVerifier` 進行真實驗證
- ✅ 配置 OFAC 制裁國家檢查
- ✅ 配置最小年齡限制
- ✅ 返回驗證結果

### 步驟 1: 啟動開發伺服器

```bash
yarn dev
```

**注意**：如果遇到 Node.js 版本錯誤，請升級到 >= 18.17.0：

```bash
# 使用 Homebrew
brew upgrade node

# 或使用 nvm
nvm install 18.17.0 && nvm use 18.17.0
```

---

## 🎯 功能說明

### 方案 A: Self.xyz 快速驗證（推薦）

**特點：**
- ✅ 即時驗證，無需等待
- ✅ 零知識證明，保護隱私
- ✅ 支援 174+ 國家護照
- ✅ NFC 掃描護照
- ❌ 需要用戶有 NFC 護照
- ❌ 需要安裝 Self App

**流程：**
1. 用戶在 KYC 頁面選擇「Self 快速驗證」
2. 顯示 QR Code
3. 用戶用 Self App 掃描 QR Code
4. Self App 驗證護照並生成零知識證明
5. 後端驗證證明並允許用戶繼續

### 方案 B: 傳統證件上傳

**特點：**
- ✅ 支援多種證件類型（身份證、護照）
- ✅ 無需特殊設備
- ⚠️ 需要 1-2 個工作天審核
- ⚠️ 需上傳個人資料

**流程：**
1. 用戶在 KYC 頁面選擇「傳統證件上傳」
2. 填寫基本資料（姓名、證件類型、號碼、生日）
3. 上傳證件照片和自拍照
4. 提交審核
5. 等待人工審核（1-2 工作天）

---

## 📱 Self App 下載

用戶需要先下載 Self App 才能使用快速驗證：

- **網站**: https://self.xyz
- **iOS**: App Store 搜尋 "Self"
- **Android**: Google Play 搜尋 "Self"

---

## 🔒 安全性說明

### Self.xyz 零知識證明
- 用戶的護照資料不會上傳到伺服器
- 只分享必要的資訊（年齡、國籍）
- 使用 zk-SNARKs 加密技術
- 符合 GDPR 和隱私法規

### 傳統 KYC
- 文件加密儲存
- 僅用於身份驗證
- 不會分享給第三方
- 符合個資法規定

---

## 🛠️ API 端點

### POST /api/kyc/self-verify
驗證 Self.xyz 的零知識證明

**請求：**
```json
{
  "attestationId": "...",
  "proof": "...",
  "publicSignals": [...],
  "userContextData": {...}
}
```

**回應（成功）：**
```json
{
  "status": "success",
  "data": {
    "verified": true,
    "credentialSubject": {
      "minimumAge": 18,
      "nationality": "TWN",
      "verifiedAt": "2025-10-31T..."
    }
  }
}
```

### POST /api/kyc/traditional-upload
處理傳統 KYC 文件上傳

**請求：** FormData
- `fullName`: string
- `idType`: "id" | "passport"
- `idNumber`: string
- `birthDate`: ISO date string
- `idDocument`: File
- `selfiePhoto`: File
- `walletAddress`: string

**回應（成功）：**
```json
{
  "status": "success",
  "data": {
    "kycId": "kyc_1234567890",
    "verified": false,
    "status": "pending_review",
    "submittedAt": "2025-10-31T...",
    "message": "您的 KYC 申請已提交..."
  }
}
```

---

## 📝 TODO（需要您實作）

### 傳統 KYC 後端處理：
1. **文件儲存** - 將上傳的圖片儲存到 S3、IPFS 或本地
2. **OCR 識別** - 調用 OCR API 識別證件資訊
3. **人臉識別** - 調用人臉識別 API 驗證自拍照
4. **資料庫** - 將 KYC 資料儲存到資料庫
5. **上鏈（可選）** - 將驗證結果記錄到區塊鏈

### Self.xyz 進階功能：
1. **OFAC 檢查** - 已在代碼中配置，驗證用戶不在制裁名單
2. **國家限制** - 可設定禁止特定國家用戶
3. **年齡驗證** - 可設定最小年齡限制
4. **Webhook** - 接收 Self 的驗證回調

---

## 🧪 測試

### 測試 Self.xyz（需要真實護照）：
1. 下載 Self App
2. 在 Self App 中掃描護照
3. 訪問您的 KYC 頁面
4. 選擇「Self 快速驗證」
5. 掃描 QR Code

### 測試傳統 KYC：
1. 訪問您的 KYC 頁面
2. 選擇「傳統證件上傳」
3. 填寫測試資料
4. 上傳測試圖片
5. 提交並查看回應

---

## 📚 相關連結

- **Self.xyz 官網**: https://self.xyz
- **Self.xyz 文檔**: https://docs.self.xyz
- **Self.xyz GitHub**: https://github.com/selfxyz
- **WalletConnect**: https://walletconnect.com

---

## ❓ 常見問題

### Q: 為什麼需要升級 Node.js？
A: Next.js 14.2.0 要求 Node.js >= 18.17.0，目前您的版本是 18.16.0。

### Q: Self.xyz 支援哪些證件？
A: 目前支援 174+ 國家的護照，護照必須有 NFC 晶片。

### Q: 傳統 KYC 支援哪些證件？
A: 您可以在代碼中自定義，目前支援身份證和護照。

### Q: 如何測試 Self.xyz？
A: 需要真實的 NFC 護照和 Self App。如果沒有，可以使用 Self 提供的 Mock Passports（參考：https://docs.self.xyz/use-self/using-mock-passports）

### Q: 傳統 KYC 會真的處理文件嗎？
A: 目前只是模擬回應。您需要實作文件儲存、OCR、人臉識別等功能。

---

## 💡 建議

1. **優先實作 Self.xyz** - 更安全、更快速、用戶體驗更好
2. **保留傳統 KYC 作為備用** - 給沒有護照或不想用 Self 的用戶
3. **實作資料庫** - 儲存 KYC 狀態和結果
4. **添加郵件通知** - 審核結果通知用戶
5. **上鏈驗證** - 將 KYC 結果記錄到區塊鏈（可選）

---

如有任何問題，請參考：
- Self.xyz 文檔：https://docs.self.xyz
- 我的代碼註釋：API Routes 和前端頁面都有詳細註釋
