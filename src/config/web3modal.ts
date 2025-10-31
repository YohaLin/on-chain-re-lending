import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defineChain } from "viem";

// 從 https://cloud.walletconnect.com 獲取你的 Project ID
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

if (!projectId) {
  console.warn(
    "⚠️ WalletConnect Project ID 未設定！請在 .env.local 加入 NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"
  );
}

// Helper: 建立 app 的公開 URL（metadata 需要）
// - 在開發時，若要在另一台手機上測試，請設定 NEXT_PUBLIC_URL 為你的局域網 IP（含協定與埠），
//   例如: https://192.168.0.225:3000 或 http://192.168.0.225:3000
// - 生產環境請務必使用 https 的公開網址，因為許多 mobile wallet 的 universal link / deep link
//   需要有效的 https origin 才能正確工作。
const getUrl = () => {
  // 若在瀏覽器端，使用當前 origin（開發或已部署時最準確）
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // 優先使用環境變數（可在本機測試時指定局域網 IP）
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }

  // 開發時的預設值（僅當你在機器上也可以被手機存取時有用）
  if (process.env.NODE_ENV === "development") {
    return "http://192.168.0.225:3000";
  }

  // 生產時的安全預設（提醒：生產應該設定 NEXT_PUBLIC_URL）
  return "https://your-domain.example";
};

const metadata = {
  name: "On-Chain Re-lending",
  description: "資產代幣化與再融資平台",
  url: getUrl(),
  // 使用動態產生的 icon URL，避免硬編 HTTP 地址造成 deep-link 被阻擋
  icons: [`${getUrl()}/logo.png`],
};

// 定義 Sapphire 鏈
export const sapphire = defineChain({
  id: 23294,
  name: "Sapphire",
  nativeCurrency: {
    decimals: 18,
    name: "ROSE",
    symbol: "ROSE",
  },
  rpcUrls: {
    default: {
      http: ["https://sapphire.oasis.io"],
      webSocket: ["wss://sapphire.oasis.io/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Oasis Sapphire Explorer",
      url: "https://explorer.oasis.io/mainnet/sapphire",
    },
  },
  contracts: {
    // 可以在這裡添加常用合約地址
  },
});

// 定義 Sapphire 測試網（可選）
export const sapphireTestnet = defineChain({
  id: 23295,
  name: "Sapphire Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "TEST",
    symbol: "TEST",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.sapphire.oasis.io"],
      webSocket: ["wss://testnet.sapphire.oasis.io/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Oasis Sapphire Testnet Explorer",
      url: "https://explorer.oasis.io/testnet/sapphire",
    },
  },
});

// 配置支持的鏈（包含 Sapphire）
const chains = [mainnet, sepolia, sapphire, sapphireTestnet] as const;

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
  defaultChain: sapphireTestnet, // 預設使用 Sapphire 測試網
  // 移動端配置 - 優先顯示 imToken
  featuredWalletIds: [
    "ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef", // imToken
  ],
  // 允許所有錢包顯示
  allWallets: "SHOW",
});

// Export a tiny helper to attempt opening a mobile wallet deep link.
// Note: this is a best-effort fallback. The ideal flow is to let Web3Modal / WalletConnect
// open the native wallet via the pairing URI. However, when you need to force a specific
// wallet open (e.g. imToken) you can call `openImToken()` from your client-side connect
// button handler. It will attempt to open the imToken app via its scheme.
//
// Usage (client-side only):
// import { openImToken } from '@/config/web3modal';
// if (isMobile()) openImToken();
export const isMobile = () => {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipod|ipad|android|mobile/i.test(navigator.userAgent);
};

export const openImToken = (path = "") => {
  if (typeof window === "undefined") return;

  // imToken scheme examples (may vary by version):
  // imtokenv2://, imtokenv2://open?screen=home
  // We try a couple of common forms.
  const schemes = [
    `imtokenv2://${path}`,
    `imtoken://connect${path}`,
    `imtoken://open${path}`,
  ];

  // Try to open the first scheme; if app not installed, browser will ignore.
  // To improve UX, you can set a timer and show fallback instructions or a link to the store.
  const open = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  try {
    for (const s of schemes) {
      open(s);
    }
  } catch (e) {
    // no-op; best-effort only
    // Consider showing a toast/fallback to install imToken
  }
};
