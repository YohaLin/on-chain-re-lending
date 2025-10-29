"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, FileText, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoanSuccess() {
  const router = useRouter();
  const [loanData, setLoanData] = useState<any>(null);

  useEffect(() => {
    // 從 sessionStorage 讀取數據
    if (typeof window !== "undefined") {
      const data = sessionStorage.getItem("loanData");
      if (data) {
        setLoanData(JSON.parse(data));
      } else {
        router.push("/my-assets");
      }
    }
  }, [router]);

  if (!loanData) {
    return null;
  }

  const { asset, loanAmount, selectedTerm, interest, actualAmount } = loanData;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + selectedTerm);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center">借款成功</h1>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* 成功訊息 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">借款成功！</h2>
          <p className="text-muted-foreground">
            您的借款申請已成功處理並發放
          </p>
        </div>

        {/* 到帳金額卡片 */}
        <Card className="mb-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">實際到帳金額</p>
            <p className="text-5xl font-bold text-primary mb-4">
              ${actualAmount.toLocaleString()}
            </p>
            <Alert className="bg-background/50">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                資金已發放至您綁定的銀行帳戶/錢包，預計 10 分鐘內到帳
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* 借款詳情 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>借款詳情</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">抵押資產</span>
              <span className="font-semibold">{asset.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">借款總額</span>
              <span className="font-semibold">${loanAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">預扣利息</span>
              <span className="font-semibold text-destructive">
                ${interest.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">借款期限</span>
              <span className="font-semibold">{selectedTerm} 天</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">到期還款日</span>
              <span className="font-semibold text-destructive">
                {dueDate.toLocaleDateString("zh-TW")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 重要提醒 */}
        <Alert className="mb-6">
          <AlertDescription className="text-sm">
            <p className="font-semibold mb-2">重要提醒：</p>
            <ul className="space-y-1 list-disc list-inside text-muted-foreground">
              <li>您需在 {dueDate.toLocaleDateString("zh-TW")} 前歸還本金 ${loanAmount.toLocaleString()}</li>
              <li>您的資產 NFT 已被鎖定作為抵押品</li>
              <li>可隨時提前還款，無額外費用</li>
              <li>逾期未還款將導致抵押資產被處置</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* 操作按鈕 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button size="lg" onClick={() => router.push("/my-loans")}>
            <FileText className="w-4 h-4 mr-2" />
            查看我的貸款
          </Button>
          <Button variant="secondary" size="lg" onClick={() => router.push("/")}>
            <Home className="w-4 h-4 mr-2" />
            返回首頁
          </Button>
        </div>
      </div>
    </div>
  );
}
