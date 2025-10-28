"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WalletConnect() {
  const [connecting, setConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const wallets = [
    {
      id: "metamask",
      name: "MetaMask",
      icon: "🦊",
      description: "最流行的以太坊錢包",
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      icon: "🔗",
      description: "連接多種移動錢包",
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      icon: "💼",
      description: "Coinbase 官方錢包",
    },
  ];

  const handleConnect = async (walletId: string) => {
    setSelectedWallet(walletId);
    setConnecting(true);

    // 模擬連接過程
    setTimeout(() => {
      setConnecting(false);
      toast({
        title: "錢包連接成功",
        description: "您的錢包已成功連接",
      });

      // 連接成功後跳轉到 KYC 頁面
      setTimeout(() => {
        router.push("/kyc-verification");
      }, 1000);
    }, 2000);
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
                  selectedWallet === wallet.id ? "border-primary bg-primary/5" : ""
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
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
