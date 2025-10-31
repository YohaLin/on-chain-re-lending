# 移動端改進說明

## 問題描述

1. **imToken 連接問題**：在手機網頁版使用 imToken 連接錢包後，不會自動跳轉回瀏覽器
2. **Self 驗證問題**：在手機上無法掃描自己手機屏幕上的 QR Code，沒有按鈕可以打開 Self App

## 解決方案

### 1. imToken 錢包連接改進

#### 修改文件
- `src/config/web3modal.ts`
- `src/app/page.tsx`

#### 實現功能

**a) 移動端檢測**
```typescript
const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
```

**b) 頁面可見性監聽**
- 當用戶從 imToken 返回瀏覽器時，自動檢測連接狀態
- 使用 `visibilitychange` 事件監聽頁面重新獲得焦點
- 每 500ms 輪詢檢查連接狀態，持續 30 秒

**c) 狀態持久化**
使用 localStorage 追蹤連接狀態：
- `wallet_connecting`: 標記正在連接
- `wallet_connected`: 標記已連接
- `wallet_address`: 儲存錢包地址

**d) 用戶提示**
- 移動端顯示專用使用提示區塊
- 明確告知用戶需要手動返回瀏覽器
- 頁面返回後自動檢測並提示狀態

### 2. Self App 驗證改進

#### 修改文件
- `src/app/kyc-verification/page.tsx`

#### 實現功能

**a) 響應式 UI**
- **桌面端**：顯示 QR Code 供掃描
- **移動端**：顯示大按鈕直接打開 Self App

**b) 深度連結支持**
```typescript
const getSelfDeepLink = () => {
  const appConfig = {
    version: 2,
    appName: "on-chain-re-lending",
    scope: "kyc-verification",
    endpoint: process.env.NEXT_PUBLIC_SELF_ENDPOINT,
    userId: address,
    userIdType: "hex",
    disclosures: {
      minimumAge: 18,
      nationality: true,
    },
  };

  const base64Config = btoa(JSON.stringify(appConfig));
  return `self://verify?data=${encodeURIComponent(base64Config)}`;
};
```

**c) 移動端體驗優化**
- 點擊按鈕直接打開 Self App
- 顯示明確的操作提示
- 返回頁面監聽和狀態檢測
- 自適應驗證步驟說明

## 使用流程

### imToken 連接流程（移動端）

1. 用戶點擊「ImToken」連接按鈕
2. 系統打開 Web3Modal，用戶選擇連接方式
3. 跳轉到 imToken 應用
4. 用戶在 imToken 中確認連接
5. **用戶手動返回瀏覽器**
6. 頁面自動檢測連接狀態（每 500ms）
7. 連接成功後顯示提示，1.5 秒後跳轉到 KYC 頁面

### Self 驗證流程（移動端）

1. 進入 KYC 驗證頁面
2. 移動端顯示「打開 Self App 進行驗證」按鈕
3. 點擊按鈕，通過深度連結打開 Self App
4. 在 Self App 中完成驗證
5. **用戶手動返回瀏覽器**
6. 頁面檢測驗證狀態
7. 驗證成功後自動跳轉到資產代幣化頁面

## 技術細節

### Web3Modal 配置
```typescript
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false,
  themeMode: "light",
  defaultChain: sepolia,
  // 優先顯示 imToken
  featuredWalletIds: [
    'ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef',
  ],
  allWallets: 'SHOW',
});
```

### 頁面可見性 API
```typescript
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    // 頁面重新可見，檢查狀態
  }
});
```

## 注意事項

1. **手動返回是必須的**
   - WalletConnect 和 Self App 的深度連結都不支持自動返回
   - 這是移動端 dApp 的標準行為
   - 我們通過智能檢測減少用戶困惑

2. **狀態檢測機制**
   - 使用輪詢而非實時連接，確保兼容性
   - 設置 30 秒超時避免無限等待
   - localStorage 持久化避免頁面刷新丟失狀態

3. **用戶體驗**
   - 移動端顯示明確的使用提示
   - 按鈕大小適合觸摸操作
   - 狀態反饋及時清晰

## 測試建議

1. **移動端測試**
   - 使用真實手機設備測試
   - 測試 imToken 連接流程
   - 測試 Self App 打開和返回

2. **桌面端測試**
   - 確認 QR Code 正常顯示
   - 測試桌面錢包連接

3. **邊界情況**
   - 用戶取消連接
   - 網絡中斷
   - 長時間未返回

## 未來改進建議

1. **推送通知**：使用 Web Push API 在驗證完成後主動通知用戶返回
2. **Webhook 回調**：如果 Self SDK 支持，可以實現服務端驗證回調
3. **二維碼備選**：移動端提供「分享連結」選項，用於多設備場景
4. **進度保存**：實現斷點續傳，避免用戶重複操作

## 相關文檔

- [WalletConnect 文檔](https://docs.walletconnect.com/)
- [Web3Modal 文檔](https://docs.walletconnect.com/web3modal/about)
- [Self.xyz 文檔](https://docs.self.xyz/)
- [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
