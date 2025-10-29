"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Send,
  Download,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TabBar from "@/components/TabBar";
import usdtIcon from "@/assets/usdt-icon.svg";
import usdcIcon from "@/assets/usdc-icon.png";

// Mock data
const mockUserData = {
  walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  kycStatus: "verified", // "verified" | "pending" | "failed" | "none"
  identityName: "Bob",
  identityIdLast4: "1234",
  totalValue: 125000, // TWD
  tokens: [
    { symbol: "USDT", balance: 3500, value: 105000, logo: usdtIcon },
    { symbol: "USDC", balance: 500, value: 15000, logo: usdcIcon }
  ]
};

const mockRWAAssets = [
  {
    id: "nft-001",
    type: "不動產",
    name: "台北市信義區豪宅",
    estimatedValue: 15000000,
    status: "collateralized", // "free" | "collateralized" | "defaulted"
    loanAmount: 10000000,
    remainingDays: 180,
    dueDate: "2025-04-28",
    image: "/placeholder.svg"
  },
  {
    id: "nft-002",
    type: "藝術品",
    name: "當代藝術畫作",
    estimatedValue: 2000000,
    status: "free",
    image: "/placeholder.svg"
  }
];

const mockTransactions = [
  {
    id: "tx-001",
    type: "send",
    token: "USDT",
    amount: 500,
    timestamp: "2025-10-28 14:30",
    status: "success",
    gasFee: 0.5
  },
  {
    id: "tx-002",
    type: "receive",
    token: "USDC",
    amount: 1000,
    timestamp: "2025-10-27 10:15",
    status: "success",
    gasFee: 0
  }
];

export default function WalletDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);

  const getKYCStatusBadge = () => {
    const statusConfig = {
      verified: { label: "KYC 已驗證", icon: CheckCircle2, variant: "default" as const },
      pending: { label: "KYC 待處理", icon: Clock, variant: "secondary" as const },
      failed: { label: "KYC 失敗", icon: XCircle, variant: "destructive" as const },
      none: { label: "未完成 KYC", icon: XCircle, variant: "outline" as const }
    };

    const config = statusConfig[mockUserData.kycStatus as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(mockUserData.walletAddress);
    toast({
      title: "地址已複製",
      description: "錢包地址已複製到剪貼簿"
    });
  };

  const handleQuickAction = (action: string) => {
    if (mockUserData.kycStatus !== "verified") {
      toast({
        title: "請先完成 KYC",
        description: "請先完成 KYC 驗證以啟動 RWA 服務",
        variant: "destructive"
      });
      return;
    }

    switch (action) {
      case "send":
        toast({ title: "發送功能開發中" });
        break;
      case "receive":
        setShowReceiveDialog(true);
        break;
      case "loan":
        router.push("/my-assets");
        break;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount).replace('TWD', 'NT$').replace(/\s/g, '');
  };

  const getAssetStatusConfig = (status: string) => {
    const configs = {
      free: { label: "未抵押", color: "text-green-600" },
      collateralized: { label: "抵押中", color: "text-yellow-600" },
      defaulted: { label: "違約待清算", color: "text-red-600" }
    };
    return configs[status as keyof typeof configs] || configs.free;
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Bar */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12" style={{ backgroundColor: '#d4ff00' }}>
                <AvatarFallback style={{ backgroundColor: '#d4ff00' }} className="text-black text-lg font-semibold">
                  {mockUserData.identityName ? mockUserData.identityName[0] : 'W'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-base">
                  {mockUserData.identityName || "User"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {mockUserData.walletAddress.slice(0, 6)}...
                    {mockUserData.walletAddress.slice(-4)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={handleCopyAddress}
                  >
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
            {getKYCStatusBadge()}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Portfolio Overview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span className="text-base">錢包總價值</span>
          </div>
          <div className="text-5xl font-bold text-foreground">
            {formatCurrency(mockUserData.totalValue)}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleQuickAction("send")}
            disabled={mockUserData.kycStatus !== "verified"}
          >
            <ArrowUpRight className="w-8 h-8" />
            <span className="text-base">發送</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleQuickAction("receive")}
          >
            <ArrowDownLeft className="w-8 h-8" />
            <span className="text-base">接收</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleQuickAction("loan")}
            disabled={mockUserData.kycStatus !== "verified"}
          >
            <Download className="w-8 h-8" />
            <span className="text-base">借款</span>
          </Button>
        </div>

        {/* Tabs for Tokens and NFTs */}
        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tokens">代幣</TabsTrigger>
            <TabsTrigger value="nfts">我的 NFT</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-4 mt-4">
            <Card className="p-6">
              <div className="space-y-3">
                {mockUserData.tokens.map((token) => (
                  <div key={token.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image src={token.logo} alt={token.symbol} width={40} height={40} />
                      <div>
                        <p className="font-medium">{token.symbol}</p>
                        <p className="text-sm text-muted-foreground">
                          {token.balance.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">{formatCurrency(token.value)}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="nfts" className="space-y-4 mt-4">
            {mockRWAAssets.map((asset) => {
              const statusConfig = getAssetStatusConfig(asset.status);

              return (
                <Card key={asset.id} className="overflow-hidden">
                  <div className="p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={asset.image}
                            alt={asset.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{asset.type}</Badge>
                            <span className={`text-xs font-medium ${statusConfig.color}`}>
                              {statusConfig.label}
                            </span>
                          </div>
                          <h3 className="font-medium mt-1">{asset.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            估值：{formatCurrency(asset.estimatedValue)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {asset.status === "collateralized" && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">抵押借貸資訊</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">借款金額</p>
                              <p className="font-medium">{formatCurrency(asset.loanAmount!)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">剩餘期限</p>
                              <p className="font-medium">{asset.remainingDays} 天</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">到期日</p>
                              <p className="font-medium">{asset.dueDate}</p>
                            </div>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => router.push("/my-loans")}
                          >
                            查看還款詳情
                          </Button>
                        </div>
                      </>
                    )}

                    {asset.status === "free" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => router.push(`/loan-setup/${asset.id}`)}
                        disabled={mockUserData.kycStatus !== "verified"}
                      >
                        申請借款
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}

            {mockRWAAssets.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">尚無 RWA 資產</p>
                <Button
                  variant="default"
                  className="mt-4"
                  onClick={() => router.push("/asset-tokenization")}
                >
                  開始代幣化資產
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* KYC Warning */}
        {mockUserData.kycStatus !== "verified" && (
          <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                  請先完成 KYC 以啟動 RWA 服務
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-200 mt-1">
                  完成身份驗證後，您將可以使用借貸等完整功能
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="mt-3"
                  onClick={() => router.push("/kyc-verification")}
                >
                  前往 KYC 驗證
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Receive Dialog */}
      <Dialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>接收資產</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="w-48 h-48 mx-auto bg-white p-4 rounded-lg">
                <div className="text-xs break-all">[QR Code]</div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">錢包地址</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-xs break-all">
                  {mockUserData.walletAddress}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAddress}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TabBar />
    </div>
  );
}
