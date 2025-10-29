"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, ExternalLink, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NFTSuccess() {
  const router = useRouter();

  const handleStartLoan = () => {
    router.push("/loan-setup/RWA-2025-001");
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto text-center">

      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">鑄造成功！</h2>
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <p className="text-lg text-muted-foreground">
          您的資產已成功代幣化並鑄造為 NFT
        </p>
      </div>

      <Card className="p-8 space-y-6">
        <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-xl flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Token ID</p>
              <p className="font-mono font-bold text-xl">#RWA-2025-001</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-t">
            <span className="text-muted-foreground">資產名稱</span>
            <span className="font-semibold">台北市信義區豪宅</span>
          </div>
          <div className="flex justify-between items-center py-3 border-t">
            <span className="text-muted-foreground">資產類型</span>
            <span className="font-semibold">房地產</span>
          </div>
          <div className="flex justify-between items-center py-3 border-t">
            <span className="text-muted-foreground">估值</span>
            <span className="font-bold text-primary text-lg">NT$ 6,400,000</span>
          </div>
          <div className="flex justify-between items-center py-3 border-t">
            <span className="text-muted-foreground">狀態</span>
            <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
              已鑄造
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6 text-left hover:shadow-lg transition-shadow cursor-pointer group max-w-md mx-auto">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <ExternalLink className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
              查看 NFT 詳情
            </h3>
            <p className="text-sm text-muted-foreground">
              在區塊鏈瀏覽器上查看您的 NFT
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">下一步：開始借貸</h3>
          <p className="text-sm text-muted-foreground">
            您現在可以使用這個 NFT 作為抵押品，在我們的平台上申請借款。根據您的資產估值，您最多可以借款 NT$ 4,480,000（LTV 70%）。
          </p>
          <Button className="w-full" size="lg" onClick={handleStartLoan}>
            開始借款
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
