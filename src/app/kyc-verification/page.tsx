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
import {
  Shield,
  CheckCircle2,
  Loader2,
  LogOut,
  QrCode,
  Smartphone,
  SkipForward,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDisconnect, useAccount } from "wagmi";
// Self.xyz SDK
import { SelfQRcodeWrapper, SelfAppBuilder } from "@selfxyz/qrcode";

// 檢測是否為移動端
const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export default function KYCVerification() {
  const [selfVerificationStatus, setSelfVerificationStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  // 檢測移動端
  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  // 建立 Self App 配置（只有在有錢包地址時才建立）
  const selfApp = address
    ? new SelfAppBuilder({
        version: 2,
        appName: process.env.SELF_APP_NAME || "on-chain-re-lending",
        scope: "kyc-verification",
        endpoint: process.env.NEXT_PUBLIC_SELF_ENDPOINT || "",
        userId: address, // 使用錢包地址作為 userId
        userIdType: "hex", // 區塊鏈地址使用 hex 格式
        disclosures: {
          minimumAge: 18,
          nationality: true,
        },
      }).build()
    : null;

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "已登出",
      description: "錢包已斷開連接",
    });
    router.push("/");
  };

  // 生成 Self App 深度連結
  const getSelfDeepLink = () => {
    if (!selfApp) return "";

    // Self App 深度連結格式: self://verify?data=base64EncodedData
    // 將 selfApp 配置編碼為 URL 參數
    const appConfig = {
      version: 2,
      appName: process.env.SELF_APP_NAME || "on-chain-re-lending",
      scope: "kyc-verification",
      endpoint: process.env.NEXT_PUBLIC_SELF_ENDPOINT || "",
      userId: address,
      userIdType: "hex",
      disclosures: {
        minimumAge: 18,
        nationality: true,
      },
    };

    // 將配置轉為 base64
    const configString = JSON.stringify(appConfig);
    const base64Config = typeof window !== "undefined"
      ? btoa(configString)
      : "";

    return `self://verify?data=${encodeURIComponent(base64Config)}`;
  };

  // 處理打開 Self App
  const handleOpenSelfApp = () => {
    const deepLink = getSelfDeepLink();

    if (deepLink) {
      setSelfVerificationStatus("pending");

      // 標記正在驗證
      if (typeof window !== "undefined") {
        localStorage.setItem("self_verifying", "true");
      }

      toast({
        title: "正在打開 Self App",
        description: "請在 Self App 中完成驗證",
      });

      // 打開深度連結
      window.location.href = deepLink;

      // 設置返回監聽
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          // 檢查驗證狀態
          setTimeout(() => {
            const isVerifying = localStorage.getItem("self_verifying");
            if (isVerifying === "true") {
              toast({
                title: "等待驗證",
                description: "若已在 Self App 中完成驗證，請稍候",
              });
            }
          }, 1000);
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      // 30 秒後清理
      setTimeout(() => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }, 30000);
    }
  };

  // 測試用：直接跳過驗證
  const handleSkipForTesting = () => {
    toast({
      title: "測試模式",
      description: "跳過 KYC 驗證，直接進入下一步",
    });

    setTimeout(() => {
      router.push("/asset-tokenization");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col gap-4">
      <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="font-semibold">Self 身份驗證</span>
          </div>
          {address && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground font-mono hidden sm:inline">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                登出
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              {isMobileDevice ? (
                <Smartphone className="w-8 h-8 text-primary" />
              ) : (
                <QrCode className="w-8 h-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isMobileDevice ? "使用 Self App 驗證" : "使用 Self App 掃描"}
            </CardTitle>
            <CardDescription>
              {isMobileDevice
                ? "點擊下方按鈕打開 Self App 完成身份驗證"
                : "請使用 Self App 掃描下方 QR Code 完成身份驗證"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 移動端：顯示按鈕 */}
            {isMobileDevice ? (
              <div className="flex flex-col items-center gap-4">
                {selfApp ? (
                  <>
                    <Button
                      size="lg"
                      className="w-full max-w-md"
                      onClick={handleOpenSelfApp}
                      disabled={selfVerificationStatus === "pending"}
                    >
                      {selfVerificationStatus === "pending" ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          等待驗證中...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-5 h-5 mr-2" />
                          打開 Self App 進行驗證
                        </>
                      )}
                    </Button>

                    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800 w-full">
                      <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
                        💡 點擊按鈕會打開 Self App，完成驗證後請手動返回此頁面
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full p-8 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                    <div className="text-center space-y-2">
                      <Loader2 className="w-12 h-12 mx-auto text-muted-foreground animate-spin" />
                      <p className="text-sm text-muted-foreground">
                        請先連接錢包
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* 桌面端：顯示 QR Code */
              <div className="flex flex-col items-center gap-4">
                {selfApp ? (
                  <div className="w-full flex justify-center">
                    <SelfQRcodeWrapper
                      selfApp={selfApp}
                      onSuccess={() => {
                        console.log("Self 驗證成功");
                        setSelfVerificationStatus("success");
                        if (typeof window !== "undefined") {
                          localStorage.removeItem("self_verifying");
                        }
                        toast({
                          title: "驗證成功",
                          description: "您的身份已通過 Self 驗證",
                        });
                        setTimeout(() => {
                          router.push("/asset-tokenization");
                        }, 1500);
                      }}
                      onError={() => {
                        console.error("Self 驗證錯誤");
                        setSelfVerificationStatus("error");
                        if (typeof window !== "undefined") {
                          localStorage.removeItem("self_verifying");
                        }
                        toast({
                          title: "驗證失敗",
                          description: "請稍後再試或聯繫客服",
                          variant: "destructive",
                        });
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                    <div className="text-center space-y-2 p-4">
                      <Loader2 className="w-12 h-12 mx-auto text-muted-foreground animate-spin" />
                      <p className="text-sm text-muted-foreground">
                        請先連接錢包
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 驗證狀態顯示 */}
            {selfVerificationStatus === "success" && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>驗證成功！</span>
              </div>
            )}

            {selfVerificationStatus === "error" && (
              <div className="flex items-center justify-center gap-2 text-sm text-red-600">
                <span>❌ 驗證失敗，請重試</span>
              </div>
            )}

            {/* 測試用跳過按鈕 */}
            <div className="border-t pt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSkipForTesting}
                disabled={selfVerificationStatus === "pending"}
              >
                <SkipForward className="w-4 h-4 mr-2" />
                測試用跳過驗證
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                僅供測試使用，正式環境請移除此按鈕
              </p>
            </div>

            {/* 說明步驟 */}
            <div className="space-y-3">
              <h4 className="font-semibold">驗證步驟：</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground">1.</span>
                  <span>下載並安裝 Self App</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground">2.</span>
                  <span>在 Self App 中使用 NFC 掃描您的護照</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground">3.</span>
                  <span>
                    {isMobileDevice
                      ? "點擊上方按鈕打開 Self App"
                      : "掃描此頁面的 QR Code"}
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground">4.</span>
                  <span>授權分享年齡和國籍資訊</span>
                </li>
                {isMobileDevice && (
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground">5.</span>
                    <span>完成後手動返回此頁面</span>
                  </li>
                )}
              </ol>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Smartphone className="w-4 h-4" />
                還沒有 Self App？
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Self 是一個保護隱私的身份驗證應用，使用零知識證明技術。
              </p>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://self.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  前往下載 Self App
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="mt-6 bg-muted/50">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              隱私保護承諾
            </h4>
            <p className="text-sm text-muted-foreground">
              使用 Self 零知識證明技術，您的護照資料不會上傳到伺服器，僅分享必要的年齡和國籍資訊。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
