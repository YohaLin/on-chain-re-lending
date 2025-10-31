import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { createWeb3Modal } from "@web3modal/wagmi/react";

// 從 https://cloud.walletconnect.com 獲取你的 Project ID
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

if (!projectId) {
  console.warn(
    "⚠️ WalletConnect Project ID 未設定！請在 .env.local 加入 NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"
  );
}

// 修正：確保 metadata URL 正確
const getUrl = () => {
  // 如果在瀏覽器端，使用當前 origin
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // 如果在開發環境且 SSR，使用你的 IP
  if (process.env.NODE_ENV === "development") {
    return "http://192.168.0.225:3000";
  }

  // 生產環境使用環境變數或預設值
  return process.env.NEXT_PUBLIC_URL || "http://192.168.0.225:3000";
};

const metadata = {
  name: "On-Chain Re-lending",
  description: "資產代幣化與再融資平台",
  url: getUrl(),
  icons: ["http://192.168.0.225:3000/logo.png"], // 改用本地 logo，或暫時用相對路徑
};

// 配置支持的鏈
const chains = [mainnet, sepolia] as const;

// 創建 wagmi 配置
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  enableWalletConnect: true,
  enableInjected: true,
  enableCoinbase: false, // 可以關閉用不到的
});

// 創建 Web3Modal 實例 - 添加更多配置
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false, // 開發時建議關閉
  themeMode: "light",
  defaultChain: sepolia, // 開發建議用測試網
});
