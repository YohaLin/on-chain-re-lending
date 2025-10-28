# React Router 轉換至 Next.js App Router 遷移指南

## 目錄
1. [專案結構變更](#專案結構變更)
2. [路由系統轉換](#路由系統轉換)
3. [導航 API 變更](#導航-api-變更)
4. [狀態傳遞方式](#狀態傳遞方式)
5. [Provider 設定](#provider-設定)
6. [逐步轉換流程](#逐步轉換流程)
7. [常見問題處理](#常見問題處理)

---

## 專案結構變更

### 舊結構（React Router）
```
src/
├── pages/
│   ├── WalletConnect.tsx
│   ├── KYCVerification.tsx
│   ├── Index.tsx
│   └── ...
├── App.tsx          # 路由配置
├── main.tsx         # 入口文件
└── index.css
```

### 新結構（Next.js App Router）
```
src/
├── app/
│   ├── layout.tsx                          # 根布局
│   ├── page.tsx                            # 首頁 (/)
│   ├── globals.css                         # 全域樣式
│   ├── providers.tsx                       # 客戶端 Providers
│   ├── kyc-verification/
│   │   └── page.tsx                        # /kyc-verification
│   ├── asset-tokenization/
│   │   └── page.tsx                        # /asset-tokenization
│   ├── loan-setup/
│   │   └── [assetId]/
│   │       └── page.tsx                    # /loan-setup/:assetId
│   └── not-found.tsx                       # 404 頁面
└── pages/                                   # 保留舊的組件（如果被引用）
    └── CustodyProcess.tsx
```

---

## 路由系統轉換

### 1. 基本路由

#### React Router (舊)
```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WalletConnect from "./pages/WalletConnect";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<WalletConnect />} />
      <Route path="/kyc-verification" element={<KYCVerification />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
```

#### Next.js App Router (新)
```
app/
├── page.tsx                    # / 路由
├── kyc-verification/
│   └── page.tsx               # /kyc-verification 路由
└── not-found.tsx              # 404 頁面
```

**規則：**
- 刪除 `App.tsx` 和 `main.tsx`
- 每個路由變成一個資料夾，內含 `page.tsx`
- 檔案系統即路由配置

### 2. 動態路由

#### React Router (舊)
```tsx
<Route path="/loan-setup/:assetId" element={<LoanSetup />} />

// 在組件中
import { useParams } from "react-router-dom";
const { assetId } = useParams();
```

#### Next.js App Router (新)
```
app/
└── loan-setup/
    └── [assetId]/
        └── page.tsx
```

```tsx
// app/loan-setup/[assetId]/page.tsx
"use client";

import { useParams } from "next/navigation";

export default function LoanSetup() {
  const params = useParams();
  const assetId = params.assetId; // 或直接解構

  return <div>Asset ID: {assetId}</div>;
}
```

**規則：**
- 動態參數用 `[paramName]` 資料夾命名
- 使用 `next/navigation` 的 `useParams()`

### 3. Catch-all 路由（404）

#### React Router (舊)
```tsx
<Route path="*" element={<NotFound />} />
```

#### Next.js App Router (新)
```tsx
// app/not-found.tsx
"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <Link href="/">Return Home</Link>
    </div>
  );
}
```

**規則：**
- 建立 `app/not-found.tsx`
- Next.js 會自動處理未匹配的路由

---

## 導航 API 變更

### 1. 基本導航

#### React Router (舊)
```tsx
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/kyc-verification");
  };

  return <button onClick={handleClick}>Go to KYC</button>;
}
```

#### Next.js App Router (新)
```tsx
"use client";

import { useRouter } from "next/navigation";

export default function MyComponent() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/kyc-verification");
  };

  return <button onClick={handleClick}>Go to KYC</button>;
}
```

### 2. 導航方法對照表

| React Router | Next.js App Router | 說明 |
|-------------|-------------------|------|
| `navigate("/path")` | `router.push("/path")` | 前往指定路徑 |
| `navigate("/path", { replace: true })` | `router.replace("/path")` | 取代當前歷史記錄 |
| `navigate(-1)` | `router.back()` | 返回上一頁 |
| `navigate(1)` | `router.forward()` | 前往下一頁 |
| ❌ | `router.refresh()` | 重新載入當前路由 |
| ❌ | `router.prefetch("/path")` | 預先載入路由 |

### 3. 鏈接組件

#### React Router (舊)
```tsx
import { Link } from "react-router-dom";

<Link to="/kyc-verification">Go to KYC</Link>
```

#### Next.js App Router (新)
```tsx
import Link from "next/link";

<Link href="/kyc-verification">Go to KYC</Link>
```

**注意：** Next.js 的 `Link` 是 `href` 而非 `to`

---

## 狀態傳遞方式

### 問題：Next.js App Router 沒有 `location.state`

#### React Router (舊) ❌
```tsx
// 傳送頁面
navigate("/loan-confirm", {
  state: {
    asset: mockAsset,
    loanAmount: 5000000,
    selectedTerm: 180
  }
});

// 接收頁面
import { useLocation } from "react-router-dom";
const location = useLocation();
const { asset, loanAmount } = location.state || {};
```

#### Next.js App Router (新) ✅

**方案 1：使用 sessionStorage（推薦用於表單流程）**

```tsx
// app/loan-setup/[assetId]/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function LoanSetup() {
  const router = useRouter();

  const handleContinue = () => {
    // 儲存數據到 sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('loanData', JSON.stringify({
        asset: mockAsset,
        loanAmount: 5000000,
        selectedTerm: 180,
      }));
    }
    router.push("/loan-confirm");
  };

  return <button onClick={handleContinue}>Continue</button>;
}
```

```tsx
// app/loan-confirm/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoanConfirm() {
  const router = useRouter();
  const [loanData, setLoanData] = useState<any>(null);

  useEffect(() => {
    // 從 sessionStorage 讀取數據
    if (typeof window !== 'undefined') {
      const data = sessionStorage.getItem('loanData');
      if (data) {
        setLoanData(JSON.parse(data));
      } else {
        // 如果沒有數據，重定向到起始頁
        router.push("/my-assets");
      }
    }
  }, [router]);

  if (!loanData) {
    return null; // 或顯示載入中
  }

  const { asset, loanAmount, selectedTerm } = loanData;

  return <div>Loan Amount: ${loanAmount}</div>;
}
```

**方案 2：使用 URL 查詢參數（適用於簡單數據）**

```tsx
// 傳送
router.push(`/loan-confirm?amount=${loanAmount}&term=${selectedTerm}`);

// 接收
import { useSearchParams } from "next/navigation";
const searchParams = useSearchParams();
const amount = searchParams.get('amount');
const term = searchParams.get('term');
```

**方案 3：使用 Context API（適用於全域狀態）**

```tsx
// app/providers.tsx
"use client";

import { createContext, useContext, useState } from "react";

const LoanContext = createContext(null);

export function LoanProvider({ children }) {
  const [loanData, setLoanData] = useState(null);

  return (
    <LoanContext.Provider value={{ loanData, setLoanData }}>
      {children}
    </LoanContext.Provider>
  );
}

export const useLoan = () => useContext(LoanContext);
```

### 狀態傳遞方式選擇指南

| 使用場景 | 推薦方案 | 原因 |
|---------|---------|------|
| 多步驟表單流程 | sessionStorage | 數據在刷新後保留 |
| 簡單的篩選、排序參數 | URL 查詢參數 | 可分享、可收藏 |
| 跨多個頁面的全域狀態 | Context API | 避免重複傳遞 |
| 大量複雜數據 | React Query / Zustand | 更好的狀態管理 |

---

## Provider 設定

### 1. 根布局文件

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "On-Chain Re-Lending",
  description: "資產代幣化與借貸平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**重點：**
- `layout.tsx` 是伺服器組件，不能使用 hooks
- 不能加 `"use client"`
- `metadata` 只能在伺服器組件中使用

### 2. 客戶端 Providers

```tsx
// app/providers.tsx
"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // 使用 useState 確保 QueryClient 只建立一次
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
```

**重點：**
- 必須加 `"use client"`
- 所有需要使用 React hooks 的 Provider 都放這裡
- QueryClient 使用 `useState` 而非直接 `new`，避免每次渲染都建立新實例

---

## 逐步轉換流程

### Step 1: 建立 App Router 結構

```bash
# 建立基本結構
mkdir -p src/app
touch src/app/layout.tsx
touch src/app/page.tsx
touch src/app/providers.tsx
touch src/app/globals.css
```

### Step 2: 複製樣式文件

```bash
# 複製 index.css 到 globals.css
cp src/index.css src/app/globals.css
```

調整 `globals.css`，移除 `#root` 相關樣式：

```css
/* 移除 */
#root {
  @apply overflow-x-hidden;
}

/* 保留 */
body {
  @apply bg-background text-foreground overflow-x-hidden;
}
```

### Step 3: 建立 Layout 和 Providers

參考上面的 [Provider 設定](#provider-設定) 章節。

### Step 4: 轉換頁面（逐一進行）

對每個頁面執行以下步驟：

#### 4.1 建立路由資料夾

```bash
# 例如：轉換 /kyc-verification 頁面
mkdir -p src/app/kyc-verification
touch src/app/kyc-verification/page.tsx
```

#### 4.2 複製並修改頁面內容

```tsx
// pages/KYCVerification.tsx (舊)
import { useNavigate } from "react-router-dom";

const KYCVerification = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/asset-tokenization");
  };

  return <div>...</div>;
};

export default KYCVerification;
```

轉換為：

```tsx
// app/kyc-verification/page.tsx (新)
"use client";

import { useRouter } from "next/navigation";

export default function KYCVerification() {
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/asset-tokenization");
  };

  return <div>...</div>;
}
```

#### 4.3 檢查清單

- [ ] 檔案開頭加上 `"use client"`
- [ ] 匯入改為 `next/navigation`
  - [ ] `useNavigate` → `useRouter`
  - [ ] `useParams` → `useParams` (from next/navigation)
  - [ ] `Link` → `Link` (from next/link)
- [ ] 導航方法改為
  - [ ] `navigate()` → `router.push()`
  - [ ] `navigate(-1)` → `router.back()`
- [ ] 移除 `useLocation` 相關代碼
- [ ] 如果有狀態傳遞，改用 sessionStorage
- [ ] 函數名稱改為 `export default function PageName()`
- [ ] 圖片組件更新
  - [ ] `<img>` → `<Image>` (from next/image)
  - [ ] 使用 `fill` 時父容器加上 `relative`

### Step 5: 處理動態路由

```bash
# 例如：/loan-setup/:assetId
mkdir -p src/app/loan-setup/[assetId]
touch src/app/loan-setup/[assetId]/page.tsx
```

```tsx
"use client";

import { useParams } from "next/navigation";

export default function LoanSetup() {
  const params = useParams();
  const assetId = params.assetId;

  return <div>Asset: {assetId}</div>;
}
```

### Step 6: 建立 404 頁面

```tsx
// app/not-found.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
        <Link href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
```

### Step 7: 測試所有頁面

```bash
npm run dev
```

逐一測試：
- [ ] 首頁載入正常
- [ ] 所有連結可點擊
- [ ] 導航功能正常
- [ ] 動態路由正常
- [ ] 狀態傳遞正常
- [ ] 404 頁面顯示正常

### Step 8: 清理舊代碼

```bash
# 刪除舊的路由文件
rm src/App.tsx
rm src/main.tsx

# 如果 pages/ 資料夾內的組件沒有被引用，可以刪除
# 但注意有些組件可能被 app/ 內的頁面引用（如 CustodyProcess.tsx）
```

更新 `package.json`：

```json
{
  "dependencies": {
    // 移除
    // "react-router-dom": "^6.x.x"
  }
}
```

```bash
npm install  # 或 yarn install
```

---

## 常見問題處理

### 1. "use client" 何時使用？

**必須使用的情況：**
- 使用 React hooks（useState, useEffect, useRouter 等）
- 使用瀏覽器 API（window, localStorage 等）
- 使用事件處理器（onClick, onChange 等）
- 使用 Context Providers

**不需使用的情況：**
- 純展示組件
- 使用 `metadata` 的頁面
- 伺服器端數據獲取

### 2. 圖片轉換為 Next.js Image 組件

#### 為什麼要使用 Next.js Image 組件？

✨ **自動優化**
- 自動轉換為 WebP 格式（現代瀏覽器）
- 自動生成不同尺寸的響應式圖片
- 延遲載入（lazy loading）
- 佔位符效果（可選）

⚡ **性能提升**
- 只載入視窗內的圖片
- 自動選擇最佳格式
- 減少頁面載入時間
- 更好的 Core Web Vitals 分數

#### 基本轉換

##### React (舊) ❌
```tsx
import logo from "@/assets/logo.png";
<img src={logo} alt="logo" className="w-full h-full object-cover" />
```

##### Next.js (新) ✅

**方案 1：使用固定尺寸（推薦用於已知尺寸的圖片）**

適用於：Logo、圖標等固定尺寸圖片

```tsx
import Image from "next/image";
import logo from "@/assets/logo.png";

<Image
  src={logo}
  alt="logo"
  width={200}
  height={100}
  className="object-cover"
/>
```

**方案 2：使用 fill 屬性（推薦用於響應式容器）**

適用於：卡片圖片、縮圖、頭像等需要填滿容器的場景

```tsx
import Image from "next/image";
import logo from "@/assets/logo.png";

// 容器必須是 relative 定位
<div className="relative w-full h-64">
  <Image
    src={logo}
    alt="logo"
    fill
    className="object-cover"
  />
</div>
```

**方案 3：繼續使用 <img> 標籤（僅在必要時）**
```tsx
// 當圖片來源是外部 URL 或需要特殊處理時
<img src={dynamicUrl} alt="logo" className="w-full h-full object-cover" />
```

#### 關鍵變更點

1. **Import 語句**
   ```tsx
   import Image from "next/image";
   ```

2. **父容器加上 `relative`（使用 fill 時）**
   - 從：`<div className="w-24 h-24 overflow-hidden">`
   - 到：`<div className="w-24 h-24 overflow-hidden relative">`

3. **使用 `fill` 屬性**
   - `fill` 會讓圖片自動填滿父容器
   - 類似 CSS 的 `position: absolute; inset: 0`

4. **className 簡化**
   - 從：`className="w-full h-full object-cover"`
   - 到：`className="object-cover"`
   - 因為 `fill` 已經處理了尺寸

#### 完整轉換範例

##### 資產卡片圖片

**舊版（React Router + img）:**
```tsx
<Card className="overflow-hidden">
  <div className="aspect-video relative overflow-hidden bg-muted">
    <img
      src={asset.image}
      alt={asset.name}
      className="w-full h-full object-cover"
    />
  </div>
</Card>
```

**新版（Next.js + Image）:**
```tsx
import Image from "next/image";

<Card className="overflow-hidden">
  <div className="aspect-video relative overflow-hidden bg-muted">
    <Image
      src={asset.image}
      alt={asset.name}
      fill
      className="object-cover"
    />
  </div>
</Card>
```

##### 小縮圖

**舊版:**
```tsx
<div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
  <img
    src={loan.asset.image}
    alt={loan.asset.name}
    className="w-full h-full object-cover"
  />
</div>
```

**新版:**
```tsx
import Image from "next/image";

<div className="w-16 h-16 rounded-lg overflow-hidden bg-muted relative">
  <Image
    src={loan.asset.image}
    alt={loan.asset.name}
    fill
    className="object-cover"
  />
</div>
```

#### 重要規則與注意事項

⚠️ **必須設定尺寸**
- 使用 `fill` 時，父容器必須有 `relative` 定位
- 或者使用 `width` 和 `height` 屬性
- 否則會出現錯誤

⚠️ **靜態導入 vs 動態路徑**
```tsx
// ✅ 靜態導入（推薦）
import img from '@/assets/photo.png';
<Image src={img} alt="..." fill />

// ✅ 動態路徑
<Image src="/images/photo.png" alt="..." width={500} height={300} />

// ✅ 外部 URL（需設定 domains）
<Image src="https://example.com/photo.png" alt="..." width={500} height={300} />
```

#### 外部圖片設定

如果使用外部圖片 URL，需要在 `next.config.js` 中設定允許的域名：

```js
// next.config.js
module.exports = {
  images: {
    domains: ['example.com', 'cdn.example.com'],
    // 或使用 remotePatterns（Next.js 14+）
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
  },
}
```

#### 快速轉換步驟

1. **加入 import**
   ```tsx
   import Image from "next/image";
   ```

2. **找到所有 `<img>` 標籤**
   ```bash
   # 使用 grep 搜尋
   grep -r "<img" src/app/
   ```

3. **更新父容器**
   - 確保有固定尺寸（width/height）或 relative 定位
   - 加上 `relative` class

4. **替換標籤**
   - `<img>` → `<Image>`
   - 加上 `fill` 屬性（響應式）或 `width`/`height`（固定尺寸）
   - 移除不必要的 `w-full h-full` class

5. **測試**
   ```bash
   npm run dev
   ```

#### 參考資源

- [Next.js Image 組件文檔](https://nextjs.org/docs/app/api-reference/components/image)
- [Image 優化指南](https://nextjs.org/docs/app/building-your-application/optimizing/images)

### 3. 環境變數

#### React (舊)
```
VITE_API_URL=https://api.example.com
```

```tsx
const apiUrl = import.meta.env.VITE_API_URL;
```

#### Next.js (新)
```
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
```

```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

**規則：**
- 客戶端可訪問的變數必須加 `NEXT_PUBLIC_` 前綴
- 伺服器端變數不需要前綴

### 4. "window is not defined" 錯誤

```tsx
// ❌ 錯誤
const data = localStorage.getItem('key');

// ✅ 正確
const data = typeof window !== 'undefined'
  ? localStorage.getItem('key')
  : null;

// ✅ 或在 useEffect 中使用
useEffect(() => {
  const data = localStorage.getItem('key');
}, []);
```

### 5. 動態導入（Code Splitting）

```tsx
// app/page.tsx
"use client";

import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // 如果組件使用瀏覽器 API
});

export default function Page() {
  return <HeavyComponent />;
}
```

### 6. Metadata 設定

```tsx
// app/layout.tsx (伺服器組件)
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My App",
  description: "App description",
};

// app/about/page.tsx (伺服器組件)
export const metadata: Metadata = {
  title: "About - My App",
};

export default function About() {
  return <div>About page</div>;
}
```

**注意：** 只有伺服器組件才能使用 `metadata`。如果頁面需要 `"use client"`，改用 `next/head`：

```tsx
"use client";

import Head from "next/head";

export default function ClientPage() {
  return (
    <>
      <Head>
        <title>Client Page</title>
      </Head>
      <div>Content</div>
    </>
  );
}
```

---

## 快速參考表

### 檔案對照

| 功能 | React Router | Next.js App Router |
|-----|-------------|-------------------|
| 路由配置 | `App.tsx` | 檔案系統（`app/` 資料夾） |
| 入口文件 | `main.tsx` | 自動處理 |
| 根組件 | `App.tsx` | `app/layout.tsx` |
| 首頁 | 在 `App.tsx` 配置 | `app/page.tsx` |
| 404 頁面 | `<Route path="*">` | `app/not-found.tsx` |
| 動態路由 | `:param` | `[param]/` |

### Import 對照

| 功能 | React Router | Next.js |
|-----|-------------|---------|
| 導航 hook | `import { useNavigate } from "react-router-dom"` | `import { useRouter } from "next/navigation"` |
| 參數 hook | `import { useParams } from "react-router-dom"` | `import { useParams } from "next/navigation"` |
| 位置 hook | `import { useLocation } from "react-router-dom"` | ❌ 改用 sessionStorage 或 URL params |
| 連結組件 | `import { Link } from "react-router-dom"` | `import Link from "next/link"` |
| 路徑 hook | ❌ | `import { usePathname } from "next/navigation"` |
| 查詢參數 | `useSearchParams` (react-router v6.4+) | `import { useSearchParams } from "next/navigation"` |

### API 方法對照

| React Router | Next.js App Router | 用途 |
|-------------|-------------------|------|
| `navigate("/path")` | `router.push("/path")` | 導航到新頁面 |
| `navigate("/path", { replace: true })` | `router.replace("/path")` | 取代當前頁面 |
| `navigate(-1)` | `router.back()` | 返回上一頁 |
| `navigate(1)` | `router.forward()` | 前往下一頁 |
| ❌ | `router.refresh()` | 重新載入當前路由 |
| ❌ | `router.prefetch("/path")` | 預先載入路由 |

---

## 轉換範例

### 完整範例：借款流程頁面

#### React Router 版本

```tsx
// pages/LoanSetup.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LoanSetup = () => {
  const navigate = useNavigate();
  const { assetId } = useParams();
  const [loanAmount, setLoanAmount] = useState(5000000);

  const handleContinue = () => {
    navigate("/loan-confirm", {
      state: {
        assetId,
        loanAmount,
        selectedTerm: 180,
      },
    });
  };

  return (
    <div>
      <h1>Loan Setup for Asset: {assetId}</h1>
      <input
        type="number"
        value={loanAmount}
        onChange={(e) => setLoanAmount(Number(e.target.value))}
      />
      <Button onClick={handleContinue}>Continue</Button>
      <Button onClick={() => navigate(-1)}>Back</Button>
    </div>
  );
};

export default LoanSetup;
```

```tsx
// pages/LoanConfirm.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LoanConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { assetId, loanAmount, selectedTerm } = location.state || {};

  if (!assetId) {
    navigate("/my-assets");
    return null;
  }

  const handleConfirm = () => {
    navigate("/loan-processing", {
      state: { assetId, loanAmount, selectedTerm },
    });
  };

  return (
    <div>
      <h1>Confirm Loan</h1>
      <p>Asset: {assetId}</p>
      <p>Amount: ${loanAmount}</p>
      <p>Term: {selectedTerm} days</p>
      <Button onClick={handleConfirm}>Confirm</Button>
      <Button onClick={() => navigate(-1)}>Back</Button>
    </div>
  );
};

export default LoanConfirm;
```

#### Next.js App Router 版本

```tsx
// app/loan-setup/[assetId]/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoanSetup() {
  const router = useRouter();
  const params = useParams();
  const assetId = params.assetId;
  const [loanAmount, setLoanAmount] = useState(5000000);

  const handleContinue = () => {
    // 使用 sessionStorage 傳遞狀態
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('loanData', JSON.stringify({
        assetId,
        loanAmount,
        selectedTerm: 180,
      }));
    }
    router.push("/loan-confirm");
  };

  return (
    <div>
      <h1>Loan Setup for Asset: {assetId}</h1>
      <input
        type="number"
        value={loanAmount}
        onChange={(e) => setLoanAmount(Number(e.target.value))}
      />
      <Button onClick={handleContinue}>Continue</Button>
      <Button onClick={() => router.back()}>Back</Button>
    </div>
  );
}
```

```tsx
// app/loan-confirm/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoanConfirm() {
  const router = useRouter();
  const [loanData, setLoanData] = useState<any>(null);

  useEffect(() => {
    // 從 sessionStorage 讀取狀態
    if (typeof window !== 'undefined') {
      const data = sessionStorage.getItem('loanData');
      if (data) {
        setLoanData(JSON.parse(data));
      } else {
        router.push("/my-assets");
      }
    }
  }, [router]);

  if (!loanData) {
    return <div>Loading...</div>; // 或返回 null
  }

  const { assetId, loanAmount, selectedTerm } = loanData;

  const handleConfirm = () => {
    // 繼續傳遞到下一頁
    router.push("/loan-processing");
  };

  return (
    <div>
      <h1>Confirm Loan</h1>
      <p>Asset: {assetId}</p>
      <p>Amount: ${loanAmount}</p>
      <p>Term: {selectedTerm} days</p>
      <Button onClick={handleConfirm}>Confirm</Button>
      <Button onClick={() => router.back()}>Back</Button>
    </div>
  );
}
```

---

## 檢查清單

轉換完成後，使用此清單確認：

### 結構檢查
- [ ] `src/app/layout.tsx` 已建立
- [ ] `src/app/page.tsx` 已建立（首頁）
- [ ] `src/app/providers.tsx` 已建立
- [ ] `src/app/globals.css` 已建立
- [ ] `src/app/not-found.tsx` 已建立
- [ ] 所有路由頁面都有對應的 `page.tsx`
- [ ] 動態路由使用 `[param]` 資料夾

### 代碼檢查
- [ ] 所有使用 hooks 的頁面都有 `"use client"`
- [ ] `react-router-dom` imports 已全部移除
- [ ] `next/navigation` imports 已正確使用
- [ ] `navigate()` 改為 `router.push()`
- [ ] `navigate(-1)` 改為 `router.back()`
- [ ] `Link to=` 改為 `Link href=`
- [ ] `location.state` 改為 sessionStorage 或其他方案
- [ ] `useParams()` 從 `next/navigation` 匯入
- [ ] `<img>` 標籤改為 `<Image>` 組件（從 `next/image` 匯入）
- [ ] 使用 `fill` 屬性時，父容器加上 `relative` class

### 功能檢查
- [ ] 所有頁面可以正常訪問
- [ ] 頁面間導航正常
- [ ] 動態路由參數正確傳遞
- [ ] 狀態在頁面間正確傳遞
- [ ] 404 頁面正常顯示
- [ ] 刷新頁面不會遺失必要數據

### 清理檢查
- [ ] `src/App.tsx` 已刪除
- [ ] `src/main.tsx` 已刪除
- [ ] `package.json` 已移除 `react-router-dom`
- [ ] 未使用的 `pages/` 檔案已刪除或移動

---

## 進階主題

### 1. 平行路由（Parallel Routes）

```
app/
├── layout.tsx
├── @team/
│   └── page.tsx
├── @analytics/
│   └── page.tsx
└── page.tsx
```

```tsx
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  analytics: React.ReactNode;
}) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  );
}
```

### 2. 攔截路由（Intercepting Routes）

```
app/
├── feed/
│   └── page.tsx
├── photo/
│   └── [id]/
│       └── page.tsx
└── @modal/
    └── (.)photo/
        └── [id]/
            └── page.tsx
```

用於實現模態框路由（如 Instagram 的圖片檢視）。

### 3. 路由群組（Route Groups）

```
app/
├── (marketing)/
│   ├── about/
│   └── blog/
└── (shop)/
    ├── products/
    └── cart/
```

`(marketing)` 和 `(shop)` 不會出現在 URL 中，用於組織代碼。

---

## 附錄

### A. Next.js App Router 資料夾命名規則

| 命名 | 用途 | 範例 |
|-----|------|------|
| `page.tsx` | 路由頁面 | `app/about/page.tsx` → `/about` |
| `layout.tsx` | 共享布局 | 包裹子路由 |
| `loading.tsx` | 載入 UI | Suspense fallback |
| `error.tsx` | 錯誤 UI | Error boundary |
| `not-found.tsx` | 404 頁面 | 未匹配路由 |
| `[folder]` | 動態路由 | `[id]` → `:id` |
| `[...folder]` | Catch-all | `[...slug]` → `*` |
| `[[...folder]]` | Optional catch-all | 包含父路由 |
| `(folder)` | 路由群組 | 不影響 URL |
| `@folder` | 平行路由 | 同時渲染多個頁面 |
| `_folder` | 私有資料夾 | 不會成為路由 |

### B. 除錯技巧

1. **檢查 Next.js 版本**
   ```bash
   npm list next
   # 確保是 13.4+ 版本
   ```

2. **清除快取**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **檢查路由樹**
   在開發模式下，Next.js 會在 console 顯示路由樹。

4. **使用 React DevTools**
   檢查組件是否正確渲染為客戶端或伺服器組件。

### C. 性能優化建議

1. **盡量使用伺服器組件**
   - 減少客戶端 JavaScript
   - 更快的初始載入

2. **使用動態導入**
   ```tsx
   const HeavyComponent = dynamic(() => import('./HeavyComponent'));
   ```

3. **使用 `loading.tsx`**
   ```tsx
   // app/dashboard/loading.tsx
   export default function Loading() {
     return <Skeleton />;
   }
   ```

4. **預先載入路由**
   ```tsx
   <Link href="/dashboard" prefetch={true}>
     Dashboard
   </Link>
   ```

---

## 參考資源

- [Next.js App Router 官方文檔](https://nextjs.org/docs/app)
- [Next.js 遷移指南](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [React Router to Next.js 遷移](https://nextjs.org/docs/app/building-your-application/upgrading/from-create-react-app)

---

**最後更新：** 2025-10-29
**適用版本：** Next.js 14+, React 18+
