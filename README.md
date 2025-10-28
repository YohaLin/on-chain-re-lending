# On-Chain Real Estate Lending Platform

區塊鏈房地產借貸平台 - 透過智能合約確保交易透明度與安全性

## 專案結構 (2024-2025 主流架構)

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 根 layout
│   ├── page.tsx                 # 首頁
│   └── api/                     # API Routes
│       └── hello/
│           └── route.ts         # 範例 API endpoint
│
├── components/                   # React 元件 (不分 client/server)
│   ├── ui/                      # 基礎 UI 元件
│   │   └── button.tsx           # 按鈕元件
│   ├── header.tsx               # Header (Server Component)
│   ├── property-card.tsx        # 房產卡片 (Server Component)
│   ├── property-list.tsx        # 房產列表 (Client Component)
│   └── wallet-button.tsx        # 錢包按鈕 (Client Component)
│
├── hooks/                       # Custom React Hooks
│   └── use-mock-properties.ts  # 模擬房產資料 hook
│
├── lib/                         # 工具函式
│   └── utils.ts                 # 通用工具 (格式化地址、價格等)
│
├── types/                       # TypeScript 型別定義
│   ├── property.ts              # 房產相關型別
│   └── contract.ts              # 智能合約型別
│
├── config/                      # 配置檔案
│   ├── site.ts                  # 網站配置
│   └── contracts.ts             # 智能合約地址配置
│
└── contracts/                   # 智能合約相關
    └── abi/                     # ABI 檔案目錄 (等工程師提供)
        └── .gitkeep
```

## 開始使用

### 安裝依賴
```bash
yarn install
```

### 啟動開發伺服器
```bash
yarn dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看結果

### 測試 API
```bash
curl http://localhost:3000/api/hello
```

## Server vs Client Components

### Server Components (預設，不需標記)
```tsx
// components/property-card.tsx
export function PropertyCard({ property }) {
  return <div>...</div>  // 在伺服器執行
}
```

**特點:**
- 在伺服器端執行
- 可以直接存取資料庫、檔案系統
- 不能使用 React hooks
- 不能處理瀏覽器事件

### Client Components (需要 "use client")
```tsx
// components/wallet-button.tsx
"use client"

import { useState } from "react"

export function WalletButton() {
  const [isConnected, setIsConnected] = useState(false)
  return <button onClick={...}>...</button>  // 在瀏覽器執行
}
```

**特點:**
- 在瀏覽器執行
- 可以使用 React hooks (useState, useEffect 等)
- 可以處理使用者互動
- **Web3 功能必須用 Client Components**

## 已建立的功能模組

### 1. 型別系統 (`src/types/`)

#### Property 型別
```typescript
interface Property {
  id: string;
  address: string;
  city: string;
  price: string;
  size: number;
  tokenId?: number;
  // ... 更多欄位
}
```

#### Contract 型別
```typescript
interface ContractConfig {
  address: `0x${string}`;
  chainId: number;
}
```

### 2. 配置系統 (`src/config/`)

#### 智能合約配置
```typescript
// config/contracts.ts
export const contracts = {
  11155111: {  // Sepolia Testnet
    address: "0x...",  // 待工程師提供
    chainId: 11155111,
  },
};
```

#### 網站配置
```typescript
// config/site.ts
export const siteConfig = {
  name: "On-Chain Real Estate",
  description: "區塊鏈房地產借貸平台",
};
```

### 3. 工具函式 (`src/lib/utils.ts`)

```typescript
formatAddress("0x1234...5678")  // 格式化錢包地址
formatPrice(25000000)            // NT$ 25,000,000
formatDate(timestamp)            // 2024/10/27
```

### 4. Hooks (`src/hooks/`)

```typescript
// 模擬房產資料 (未來會改成真實合約讀取)
const { properties, isLoading } = useMockProperties();
```

## 下一步：整合智能合約

當工程師提供智能合約後，你需要做：

### 1. 放置 ABI 檔案
```bash
src/contracts/abi/PropertyNFT.json  # 工程師會給你
```

### 2. 更新合約地址
```typescript
// src/config/contracts.ts
export const contracts = {
  11155111: {
    address: "0x實際的合約地址",  // 更新這裡
    chainId: 11155111,
  },
};
```

### 3. 安裝 Web3 套件
```bash
yarn add wagmi viem@2.x @tanstack/react-query @rainbow-me/rainbowkit
```

### 4. 建立 Web3 配置
```typescript
// src/lib/wagmi.ts
import { createConfig } from 'wagmi'
// ... 配置錢包連接
```

### 5. 建立合約互動 Hook
```typescript
// src/hooks/use-property-contract.ts
export function usePropertyContract() {
  // 使用 wagmi 讀取合約
}
```

## 技術棧

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Package Manager**: Yarn
- **Styling**: Inline styles (未安裝 CSS 框架)
- **Web3**: 準備整合 Wagmi + Viem

## 支援的區塊鏈網路

- **Sepolia** (Ethereum Testnet) - Chain ID: 11155111
- **Mumbai** (Polygon Testnet) - Chain ID: 80001

## 專案特色

✅ 主流 2024-2025 專案結構
✅ Server Components 優先 (效能最佳化)
✅ TypeScript 完整型別定義
✅ 清晰的資料夾分層
✅ 準備好 Web3 整合
✅ 模擬資料方便開發

## 常見問題

### Q: 為什麼不分 client/ 和 server/ 資料夾？
A: Next.js 13+ 預設就是 Server Component，只有需要互動的才加 `"use client"`，這是社群主流做法。

### Q: 什麼時候用 Client Component？
A:
- 使用 React hooks (useState, useEffect 等)
- 處理瀏覽器事件 (onClick, onChange 等)
- 使用 Web3 功能 (連接錢包、讀取合約)

### Q: ABI 檔案要放哪裡？
A: `src/contracts/abi/` 目錄，工程師給你 JSON 檔案後直接放進去。

## 授權

MIT
