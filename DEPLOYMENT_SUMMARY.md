# 🚀 Vercel 部署總結

## ✅ 已完成的配置

### 1. 環境變數文件

| 文件 | 用途 | Git 追蹤 |
|------|------|----------|
| `.env.local` | 本地開發環境 | ❌ 不追蹤（在 .gitignore 中） |
| `.env.production` | 生產環境參考 | ✅ 追蹤（僅供參考） |

### 2. 環境變數配置

**本地開發** (`.env.local`):
```env
NEXT_PUBLIC_URL=http://192.168.0.225:3000
NEXT_PUBLIC_SELF_ENDPOINT=http://192.168.0.225:3000/api/kyc/self-verify
```

**Vercel 生產環境** (需在 Dashboard 設定):
```env
NEXT_PUBLIC_URL=https://on-chain-re-lending.vercel.app
NEXT_PUBLIC_SELF_ENDPOINT=https://on-chain-re-lending.vercel.app/api/kyc/self-verify
```

---

## 📋 Vercel Dashboard 設定步驟

### 立即前往設定：

1. **登入 Vercel**: https://vercel.com/dashboard
2. **選擇專案**: on-chain-re-lending
3. **前往設定**: Settings → Environment Variables
4. **添加以下 5 個環境變數**：

```
┌─────────────────────────────────────────────────────────────┐
│ 1. NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID                    │
│    Value: 7d6b0aff99987b4d5108d656c3eaf857                 │
│    Environment: ☑ Production ☑ Preview ☑ Development      │
├─────────────────────────────────────────────────────────────┤
│ 2. NEXT_PUBLIC_URL                                          │
│    Value: https://on-chain-re-lending.vercel.app          │
│    Environment: ☑ Production ☑ Preview ☑ Development      │
├─────────────────────────────────────────────────────────────┤
│ 3. SELF_APP_NAME                                            │
│    Value: on-chain-re-lending                              │
│    Environment: ☑ Production ☑ Preview ☑ Development      │
├─────────────────────────────────────────────────────────────┤
│ 4. NEXT_PUBLIC_SELF_ENDPOINT                                │
│    Value: https://on-chain-re-lending.vercel.app/api/...  │
│    Environment: ☑ Production ☑ Preview ☑ Development      │
├─────────────────────────────────────────────────────────────┤
│ 5. SELF_MINIMUM_AGE                                         │
│    Value: 18                                                │
│    Environment: ☑ Production ☑ Preview ☑ Development      │
└─────────────────────────────────────────────────────────────┘
```

5. **重新部署**: Deployments → 最新部署 → ... → Redeploy

---

## 🎯 快速設定（複製貼上）

直接在 Vercel Dashboard 中使用：

### Variable 1
```
Name: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
Value: 7d6b0aff99987b4d5108d656c3eaf857
```

### Variable 2
```
Name: NEXT_PUBLIC_URL
Value: https://on-chain-re-lending.vercel.app
```

### Variable 3
```
Name: SELF_APP_NAME
Value: on-chain-re-lending
```

### Variable 4
```
Name: NEXT_PUBLIC_SELF_ENDPOINT
Value: https://on-chain-re-lending.vercel.app/api/kyc/self-verify
```

### Variable 5
```
Name: SELF_MINIMUM_AGE
Value: 18
```

---

## ✅ 部署後驗證

### 1. 檢查網站是否正常
```
✅ https://on-chain-re-lending.vercel.app
```

### 2. 檢查 KYC 頁面
```
✅ https://on-chain-re-lending.vercel.app/kyc-verification
```

應該能看到：
- ✅ 兩個驗證選項（Self 快速驗證、傳統證件上傳）
- ✅ 選擇「Self 快速驗證」後顯示 QR Code
- ✅ 選擇「傳統證件上傳」後顯示表單

### 3. 測試 API Endpoint
在瀏覽器訪問：
```
https://on-chain-re-lending.vercel.app/api/kyc/self-verify
```

應該會看到錯誤訊息（正常，因為沒有提供數據）

---

## 🔍 排查問題

### 如果 QR Code 沒有顯示：

1. **檢查環境變數**
   - 在 Vercel Dashboard 確認所有變數都已設定
   - 確認已選擇 Production 環境

2. **檢查控制台錯誤**
   - 打開瀏覽器開發者工具 (F12)
   - 查看 Console 是否有錯誤

3. **重新部署**
   - Vercel Dashboard → Deployments → Redeploy

### 如果 API 報錯：

1. **檢查 Vercel Functions Logs**
   - Vercel Dashboard → Deployments → 最新部署 → Functions
   - 查看 `/api/kyc/self-verify` 的日誌

2. **確認套件已安裝**
   - 檢查 `package.json` 中有 `@selfxyz/qrcode` 和 `@selfxyz/core`

---

## 📚 相關文檔

| 文檔 | 說明 |
|------|------|
| [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) | 詳細的 Vercel 部署指南 |
| [SELF_KYC_SETUP.md](SELF_KYC_SETUP.md) | Self.xyz 整合完整指南 |
| [.env.production](.env.production) | 生產環境變數參考 |
| [.env.local](.env.local) | 本地開發環境變數 |

---

## ❓ 常見問題

### Q: 為什麼需要兩個不同的 endpoint？

**本地開發**:
- `http://192.168.0.225:3000/api/kyc/self-verify`
- 用於區域網路測試，手機可以訪問

**Vercel 生產**:
- `https://on-chain-re-lending.vercel.app/api/kyc/self-verify`
- 公開的 HTTPS URL，Self App 可以訪問

### Q: `.env.production` 會被上傳到 Git 嗎？

A: 會的，但這是安全的！`.env.production` 只是參考文件，不包含敏感資訊。真正的環境變數在 Vercel Dashboard 中設定。

### Q: 如果我更改了環境變數，需要重新部署嗎？

A: 是的！更新 Vercel Dashboard 的環境變數後，必須重新部署才會生效。

### Q: 本地開發和 Vercel 部署可以同時使用嗎？

A: 可以！它們使用不同的環境變數：
- 本地：`.env.local`
- Vercel：Dashboard 設定

---

## 🎉 完成！

設定好 Vercel 環境變數並重新部署後，您的網站就能完整運行 Self.xyz KYC 驗證了！

**測試流程**：
1. 訪問 https://on-chain-re-lending.vercel.app/kyc-verification
2. 選擇「Self 快速驗證」
3. 使用 Self App 掃描 QR Code
4. 完成身份驗證
5. 自動跳轉到資產代幣化頁面

---

需要更多幫助？請參考完整文檔或聯繫支援！
