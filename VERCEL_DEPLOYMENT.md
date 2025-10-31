# Vercel 部署配置指南

## 📋 您的部署資訊

- **部署網址**: https://on-chain-re-lending.vercel.app
- **專案名稱**: on-chain-re-lending

---

## 🔧 在 Vercel Dashboard 設定環境變數

### 步驟 1: 前往 Vercel Dashboard

1. 登入 Vercel: https://vercel.com
2. 選擇您的專案: `on-chain-re-lending`
3. 點擊 **Settings**
4. 點擊左側選單的 **Environment Variables**

### 步驟 2: 添加以下環境變數

請逐一添加以下環境變數：

#### 1. WalletConnect Project ID
```
Name: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
Value: 7d6b0aff99987b4d5108d656c3eaf857
Environment: Production, Preview, Development (全選)
```

#### 2. 網站 URL
```
Name: NEXT_PUBLIC_URL
Value: https://on-chain-re-lending.vercel.app
Environment: Production, Preview, Development (全選)
```

#### 3. Self App Name
```
Name: SELF_APP_NAME
Value: on-chain-re-lending
Environment: Production, Preview, Development (全選)
```

#### 4. Self Endpoint
```
Name: NEXT_PUBLIC_SELF_ENDPOINT
Value: https://on-chain-re-lending.vercel.app/api/kyc/self-verify
Environment: Production, Preview, Development (全選)
```

#### 5. Self 最小年齡限制
```
Name: SELF_MINIMUM_AGE
Value: 18
Environment: Production, Preview, Development (全選)
```

### 步驟 3: 重新部署

設定完環境變數後：

1. 點擊 **Deployments** 選項卡
2. 找到最新的部署
3. 點擊右側的 **...** 按鈕
4. 選擇 **Redeploy**
5. 確認重新部署

或者：

```bash
# 在本地推送新的 commit 觸發自動部署
git add .
git commit -m "Update environment variables"
git push
```

---

## 📸 Vercel Dashboard 截圖參考

### Environment Variables 頁面應該長這樣：

```
┌─────────────────────────────────────────────────────────────────┐
│ Environment Variables                                           │
├─────────────────────────────────────────────────────────────────┤
│ NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID                            │
│ Value: 7d6b0aff99987b4d5108d656c3eaf857                         │
│ Environments: Production, Preview, Development                  │
├─────────────────────────────────────────────────────────────────┤
│ NEXT_PUBLIC_URL                                                 │
│ Value: https://on-chain-re-lending.vercel.app                  │
│ Environments: Production, Preview, Development                  │
├─────────────────────────────────────────────────────────────────┤
│ SELF_APP_NAME                                                   │
│ Value: on-chain-re-lending                                     │
│ Environments: Production, Preview, Development                  │
├─────────────────────────────────────────────────────────────────┤
│ NEXT_PUBLIC_SELF_ENDPOINT                                       │
│ Value: https://on-chain-re-lending.vercel.app/api/kyc/self-... │
│ Environments: Production, Preview, Development                  │
├─────────────────────────────────────────────────────────────────┤
│ SELF_MINIMUM_AGE                                                │
│ Value: 18                                                       │
│ Environments: Production, Preview, Development                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ 驗證部署是否成功

### 1. 檢查環境變數

訪問您的網站：
```
https://on-chain-re-lending.vercel.app
```

打開瀏覽器的開發者工具（F12），在 Console 中輸入：
```javascript
console.log(process.env.NEXT_PUBLIC_SELF_ENDPOINT)
```

應該會顯示：
```
https://on-chain-re-lending.vercel.app/api/kyc/self-verify
```

### 2. 測試 KYC 頁面

訪問：
```
https://on-chain-re-lending.vercel.app/kyc-verification
```

- 應該能看到兩個驗證選項
- 選擇「Self 快速驗證」
- 應該能看到 Self QR Code

### 3. 測試 API

在瀏覽器中訪問：
```
https://on-chain-re-lending.vercel.app/api/kyc/self-verify
```

應該會看到錯誤訊息（因為沒有提供驗證數據），但這表示 API 正在運行。

---

## 🚨 常見問題

### Q: 為什麼不在 `next.config.js` 中設定環境變數？

A: `next.config.js` 是用來配置 Next.js 的行為（如 CSP、重定向等），不是用來設定環境變數的。環境變數應該在：
- 本地開發：`.env.local`
- Vercel 部署：Vercel Dashboard 的 Environment Variables

### Q: `.env.production` 文件有什麼用？

A: `.env.production` 僅供參考，讓您知道生產環境需要哪些變數。Vercel 部署時會使用 Dashboard 中設定的環境變數，不會讀取 `.env.production`。

### Q: `NEXT_PUBLIC_` 開頭的變數有什麼特別？

A: `NEXT_PUBLIC_` 開頭的環境變數會被打包到前端代碼中，可以在瀏覽器中訪問。沒有這個前綴的變數（如 `SELF_APP_NAME`）只能在伺服器端訪問。

### Q: 為什麼 endpoint 必須是 HTTPS？

A: Self App 要求 endpoint 必須是公開可訪問的 HTTPS URL，以確保安全性。Vercel 自動提供 HTTPS。

### Q: 如何更新環境變數？

A:
1. 在 Vercel Dashboard 更新環境變數
2. 重新部署（Redeploy）
3. 或者推送新的 commit 觸發自動部署

---

## 📝 環境變數快速複製

**快速設定**：您可以直接複製下面的內容，在 Vercel Dashboard 中逐一添加：

```env
# 1. WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=7d6b0aff99987b4d5108d656c3eaf857

# 2. 網站 URL
NEXT_PUBLIC_URL=https://on-chain-re-lending.vercel.app

# 3. Self App Name
SELF_APP_NAME=on-chain-re-lending

# 4. Self Endpoint
NEXT_PUBLIC_SELF_ENDPOINT=https://on-chain-re-lending.vercel.app/api/kyc/self-verify

# 5. Self 最小年齡
SELF_MINIMUM_AGE=18
```

---

## 🎯 部署檢查清單

部署前請確認：

- [ ] 已在 Vercel Dashboard 添加所有環境變數
- [ ] 環境變數已選擇 Production, Preview, Development
- [ ] 已重新部署
- [ ] 訪問 https://on-chain-re-lending.vercel.app 確認網站正常
- [ ] 訪問 KYC 頁面確認 Self QR Code 顯示
- [ ] 已安裝 Self App 並可以掃描 QR Code

---

## 📚 相關連結

- **Vercel 環境變數文檔**: https://vercel.com/docs/environment-variables
- **Next.js 環境變數文檔**: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables
- **Self.xyz 文檔**: https://docs.self.xyz

---

需要幫助？請查看：
- [SELF_KYC_SETUP.md](SELF_KYC_SETUP.md) - Self.xyz 整合指南
- [next.config.js](next.config.js) - Next.js 配置（CSP 等）
