# Google Maps API 設定指南

本專案使用 Google Maps Places API 來提供地址自動完成功能。

## 功能說明

在「資產代幣化」頁面中的「資產地址」欄位，使用者可以輸入地址並獲得自動完成建議，讓使用者更容易且準確地輸入地址資訊。

## 設定步驟

### 1. 申請 Google Maps API 金鑰

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 **Places API**：
   - 在左側選單選擇「API 和服務」> 「資料庫」
   - 搜尋「Places API」
   - 點擊「Places API」並啟用

### 2. 建立 API 金鑰

1. 在 Google Cloud Console 中，選擇「API 和服務」> 「憑證」
2. 點擊「建立憑證」> 「API 金鑰」
3. 複製產生的 API 金鑰

### 3. 設定 API 金鑰限制（建議）

為了安全性，建議設定 API 金鑰的使用限制：

#### 應用程式限制
- **開發環境**：選擇「HTTP 參照網址 (網站)」
  - 新增網站限制：`http://localhost:3000/*`
  - 新增網站限制：`http://127.0.0.1:3000/*`
  - 如果使用區域網路 IP，也要加上（例如：`http://192.168.*:3000/*`）

- **正式環境**：選擇「HTTP 參照網址 (網站)」
  - 新增您的網域（例如：`https://yourdomain.com/*`）

#### API 限制
- 選擇「限制金鑰」
- 在「選取 API」中，只勾選「Places API」

### 4. 設定環境變數

將 API 金鑰加入專案的環境變數檔案：

#### 本地開發
編輯 `.env.local` 檔案：
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=你的_API_金鑰
```

#### 正式環境（Vercel）
1. 前往 Vercel Dashboard
2. 選擇您的專案
3. 進入「Settings」>「Environment Variables」
4. 新增環境變數：
   - Key: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Value: 你的 API 金鑰
   - Environment: Production

### 5. 安裝必要套件

執行以下指令安裝 Google Maps JavaScript API Loader：

```bash
npm install @googlemaps/js-api-loader
# 或
yarn add @googlemaps/js-api-loader
```

### 6. 重新啟動開發伺服器

設定完成後，請重新啟動開發伺服器：

```bash
npm run dev
# 或
yarn dev
```

## 使用說明

設定完成後，當使用者在「資產代幣化」頁面填寫資產資訊時：

1. 點選「資產地址」欄位
2. 開始輸入地址
3. 系統會顯示自動完成的地址建議（限制在台灣地區）
4. 點擊建議項目即可自動填入完整地址

## 故障排除

### 問題：無法載入地址自動完成功能

**可能原因與解決方式**：

1. **API 金鑰未設定或錯誤**
   - 檢查 `.env.local` 中的 `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 是否正確
   - 確認環境變數的名稱沒有拼錯

2. **Places API 未啟用**
   - 確認在 Google Cloud Console 中已啟用 Places API

3. **API 金鑰限制設定錯誤**
   - 檢查 API 金鑰的網站限制是否包含您目前使用的網址
   - 開發時可以暫時移除限制進行測試

4. **超過 API 使用配額**
   - 檢查 Google Cloud Console 中的配額使用情況
   - Google Maps Platform 提供每月 $200 美元的免費額度

5. **網路連線問題**
   - 確認網路連線正常
   - 檢查是否有防火牆阻擋 Google Maps API 的請求

### 問題：顯示「Google Maps API 金鑰未設定」

這表示環境變數未正確載入，請：
1. 確認 `.env.local` 檔案存在且位於專案根目錄
2. 確認變數名稱為 `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`（注意前綴 `NEXT_PUBLIC_` 是必要的）
3. 重新啟動開發伺服器

## 定價資訊

Google Maps Platform 採用用量計費制：

- **免費額度**：每月 $200 美元的免費使用額度
- **Places API - Autocomplete (Per Session)**：約 $2.83 USD / 1000 requests
- **Places API - Autocomplete (Per Request)**：約 $17 USD / 1000 requests

建議使用 Session-based 定價方式（本專案已預設使用），可大幅降低成本。

詳細定價請參考：[Google Maps Platform Pricing](https://mapsplatform.google.com/pricing/)

## 技術細節

### 組件說明

- **AddressAutocomplete.tsx**：封裝了 Google Maps Places Autocomplete 的 React 組件
  - 支援台灣地區地址限制
  - 支援繁體中文介面
  - 包含錯誤處理和降級方案
  - 自動清理 Google Maps 事件監聽器

### API 設定

```typescript
{
  componentRestrictions: { country: "tw" }, // 限制台灣地區
  fields: ["formatted_address", "address_components", "geometry", "name"],
  types: ["address"], // 只顯示地址類型的建議
}
```

### 語言和地區設定

```typescript
{
  language: "zh-TW", // 繁體中文
  region: "TW",      // 台灣地區
}
```

## 參考資料

- [Google Maps Places API 文件](https://developers.google.com/maps/documentation/places/web-service)
- [Places Autocomplete 文件](https://developers.google.com/maps/documentation/javascript/place-autocomplete)
- [@googlemaps/js-api-loader](https://www.npmjs.com/package/@googlemaps/js-api-loader)
