"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, FileText, AlertCircle, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function LoanConfirm() {
  const router = useRouter();
  const [loanData, setLoanData] = useState<any>(null);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    // 從 sessionStorage 讀取數據
    if (typeof window !== "undefined") {
      const data = sessionStorage.getItem("loanData");
      if (data) {
        setLoanData(JSON.parse(data));
      } else {
        // 如果沒有數據，重定向到起始頁
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

  const handleConfirm = () => {
    // 繼續傳遞到下一頁
    router.push("/loan-processing");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">確認借款合約</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            請仔細閱讀以下借款條款。一旦確認，您的資產 NFT 將被鎖定作為抵押品。
          </AlertDescription>
        </Alert>

        {/* 借款條款摘要 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              借款條款摘要
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between py-3 border-b">
                <span className="text-muted-foreground">抵押資產</span>
                <span className="font-semibold">{asset.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-muted-foreground">資產估值</span>
                <span className="font-semibold">
                  ${asset.valuation.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-muted-foreground">借款總額</span>
                <span className="font-semibold text-lg">
                  ${loanAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-muted-foreground">年利率</span>
                <span className="font-semibold">5.0%</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-muted-foreground">借款期限</span>
                <span className="font-semibold">{selectedTerm} 天</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-muted-foreground">預扣利息</span>
                <span className="font-semibold text-destructive">
                  ${interest.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-muted-foreground">實際到帳金額</span>
                <span className="font-semibold text-primary text-xl">
                  ${actualAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">到期日</span>
                <span className="font-semibold">
                  {dueDate.toLocaleDateString("zh-TW")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 還款條件 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>還款條件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-primary">1</span>
              </div>
              <div>
                <p className="font-semibold mb-1">到期還款</p>
                <p className="text-muted-foreground">
                  您需在 {dueDate.toLocaleDateString("zh-TW")} 前歸還借款本金 $
                  {loanAmount.toLocaleString()}。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-primary">2</span>
              </div>
              <div>
                <p className="font-semibold mb-1">提前還款</p>
                <p className="text-muted-foreground">
                  您可隨時提前還款，無需支付額外費用。利息已於放款時預扣。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-destructive">
                  3
                </span>
              </div>
              <div>
                <p className="font-semibold mb-1 text-destructive">違約後果</p>
                <p className="text-muted-foreground">
                  若未能在到期日前還款，您的抵押資產 NFT
                  將被平台處置以償還債務。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 法律文件 */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">完整借款合約</p>
                <p className="text-xs text-muted-foreground">
                  點擊查看完整的法律條款與細則
                </p>
              </div>
              <Link
                target="_blank"
                href="https://docs.google.com/document/d/10gU-XE7OoqFH2fFbDHDa-qGqU_LQh9N3jC5I9lydRI4/edit?usp=sharing"
              >
                <Button variant="ghost" size="sm">
                  查看
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 同意條款 */}
        <Card className="mb-6 border-primary/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-relaxed cursor-pointer"
              >
                我已閱讀並完全理解上述借款條款，同意將我的資產 NFT
                作為抵押品進行鎖定，並承諾按時還款。我了解若逾期未還款，平台有權處置我的抵押資產。
              </label>
            </div>
          </CardContent>
        </Card>

        {/* 操作按鈕 */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
          >
            返回修改
          </Button>
          <Button
            className="flex-1"
            size="lg"
            disabled={!agreed}
            onClick={handleConfirm}
          >
            <Lock className="w-4 h-4 mr-2" />
            確認借款並簽署
          </Button>
        </div>
      </div>
    </div>
  );
}
