"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
// 確保 Web3Modal 配置被載入
import "@/config/web3modal";
import {
  openImToken as openImTokenHelper,
  isMobile as isMobileHelper,
} from "@/config/web3modal";

// 檢測是否為移動端
const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export default function WalletConnect() {
  const [connecting, setConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  // 初始化時檢查連接狀態
  useEffect(() => {
    // 延遲檢查，給 WalletConnect 時間恢復會話
    const timer = setTimeout(() => {
      setIsCheckingConnection(false);

      // 檢查是否從移動端錢包返回，且正在連接中
      if (typeof window !== "undefined") {
        const wasConnecting = localStorage.getItem("wallet_connecting");
        if (wasConnecting === "true" && !isConnected) {
          // 仍在等待連接，顯示提示
          setConnecting(true);
          toast({
            title: "正在連接錢包",
            description: "請在錢包應用中確認連接",
          });
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [isConnected, toast]);

  const wallets = [
    {
      id: "walletconnect",
      name: "WalletConnect",
      icon: "🔗",
      description: "支援多種移動端和桌面錢包",
    },
  ];

  // 當錢包連接成功時自動跳轉
  useEffect(() => {
    if (isConnected && address && !isCheckingConnection) {
      setConnecting(false);

      // 儲存連接標記到 localStorage，用於移動端返回檢測
      if (typeof window !== "undefined") {
        localStorage.setItem("wallet_connected", "true");
        localStorage.setItem("wallet_address", address);
      }

      toast({
        title: "錢包連接成功",
        description: `地址: ${address.slice(0, 6)}...${address.slice(-4)}`,
      });

      // 連接成功後跳轉到 KYC 頁面
      setTimeout(() => {
        router.push("/kyc-verification");
      }, 1500);
    }
  }, [isConnected, address, isCheckingConnection, router, toast]);

  const handleConnect = async (walletId: string) => {
    setSelectedWallet(walletId);
    setConnecting(true);

    try {
      if (walletId === "walletconnect") {
        // 在移動端標記正在連接，以便返回時檢測
        if (isMobile() && typeof window !== "undefined") {
          localStorage.setItem("wallet_connecting", "true");
          localStorage.setItem("wallet_type", "walletconnect");
        }

        // 打開 Web3Modal 顯示 WalletConnect
        await open({ view: "Connect" });

        // 移動端：設置一個監聽器，當頁面重新獲得焦點時檢查連接狀態
        if (isMobile()) {
          const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
              // 頁面重新可見，檢查是否已連接
              const checkConnection = setInterval(() => {
                if (isConnected) {
                  clearInterval(checkConnection);
                  localStorage.removeItem("wallet_connecting");
                  document.removeEventListener(
                    "visibilitychange",
                    handleVisibilityChange
                  );
                }
              }, 500);

              // 30秒後停止檢查
              setTimeout(() => {
                clearInterval(checkConnection);
                localStorage.removeItem("wallet_connecting");
                document.removeEventListener(
                  "visibilitychange",
                  handleVisibilityChange
                );
              }, 30000);
            }
          };
          document.addEventListener("visibilitychange", handleVisibilityChange);
        }
      }
    } catch (error) {
      console.error("連接失敗:", error);
      setConnecting(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("wallet_connecting");
      }
      toast({
        title: "連接失敗",
        description: "請重試",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            連接錢包
          </Button>
        </div>
      </header>

      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-73px)]">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">連接錢包</CardTitle>
            <CardDescription className="text-base">
              請選擇您的數位錢包以開始資產代幣化流程
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {wallets.map((wallet) => (
                <Card
                  key={wallet.id}
                  className={`cursor-pointer transition-all hover:border-primary ${
                    selectedWallet === wallet.id
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => !connecting && handleConnect(wallet.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{wallet.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{wallet.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {wallet.description}
                        </p>
                      </div>
                      {connecting && selectedWallet === wallet.id ? (
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      ) : selectedWallet === wallet.id ? (
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      ) : (
                        <div className="w-6 h-6" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span>🔒</span>
                安全提示
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 我們不會儲存您的私鑰或助記詞</li>
                <li>• 連接錢包是安全且可隨時中斷的</li>
                <li>• 請確保您使用的是官方錢包應用</li>
              </ul>
            </div>

            {isMobile() && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-900">
                  <span>📱</span>
                  移動端使用提示
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 點擊 WalletConnect 後會顯示 QR code 或跳轉到錢包應用</li>
                  <li>• 在錢包中確認連接後，請手動返回此頁面</li>
                  <li>• 返回後系統會自動檢測連接狀態</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
