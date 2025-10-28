"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Info } from "lucide-react";
import realEstateImage from "@/assets/real-estate-building.png";

// 模擬資產數據
const mockAsset = {
  id: "nft-001",
  name: "台北市中正區豪宅",
  type: "不動產",
  image: realEstateImage,
  valuation: 15000000,
  tokenId: "0x1234...5678",
  maxLTV: 0.6, // 最高可貸成數 60%
};

// 期限選項（天數）
const termOptions = [
  { days: 30, label: "30天" },
  { days: 90, label: "90天" },
  { days: 180, label: "180天" },
  { days: 365, label: "365天" },
];

// 年化利率
const ANNUAL_RATE = 0.05; // 5%

export default function LoanSetup() {
  const router = useRouter();
  const params = useParams();
  const assetId = params.assetId;

  const [loanAmount, setLoanAmount] = useState(5000000);
  const [selectedTerm, setSelectedTerm] = useState(180);

  const maxLoanAmount = mockAsset.valuation * mockAsset.maxLTV;

  // 計算利息和實際到帳金額
  const calculateInterest = (principal: number, days: number) => {
    return Math.round(principal * ANNUAL_RATE * (days / 365));
  };

  const interest = calculateInterest(loanAmount, selectedTerm);
  const actualAmount = loanAmount - interest;

  const handleContinue = () => {
    // In Next.js App Router, we need to use a different approach for passing state
    // We'll use localStorage or URL params, or create a context
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('loanData', JSON.stringify({
        asset: mockAsset,
        loanAmount,
        selectedTerm,
        interest,
        actualAmount,
      }));
    }
    router.push("/loan-confirm");
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
            <h1 className="text-2xl font-bold">設定借款條件</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 資產資訊 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted relative">
                <Image
                  src={mockAsset.image}
                  alt={mockAsset.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{mockAsset.name}</h3>
                  <Badge>{mockAsset.type}</Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">資產估值</span>
                    <span className="font-semibold">
                      ${mockAsset.valuation.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">最高可貸額度</span>
                    <span className="font-semibold text-primary">
                      ${maxLoanAmount.toLocaleString()} (60%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 借款金額設定 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              借款金額
              <Info className="w-4 h-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-primary">
                ${loanAmount.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                最高可借 ${maxLoanAmount.toLocaleString()}
              </p>
            </div>
            <Slider
              value={[loanAmount]}
              onValueChange={(value) => setLoanAmount(value[0])}
              min={100000}
              max={maxLoanAmount}
              step={100000}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$100,000</span>
              <span>${maxLoanAmount.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* 借款期限選擇 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>借款期限</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {termOptions.map((option) => (
                <Button
                  key={option.days}
                  variant={selectedTerm === option.days ? "default" : "outline"}
                  onClick={() => setSelectedTerm(option.days)}
                  className="h-16"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 即時預覽 */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle>借款預覽</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">借款總額</span>
              <span className="text-xl font-bold">
                ${loanAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">
                預扣總利息 ({(ANNUAL_RATE * 100).toFixed(1)}% 年利率)
              </span>
              <span className="text-xl font-semibold text-destructive">
                -${interest.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">借款期限</span>
              <span className="text-xl font-semibold">{selectedTerm} 天</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-primary/10 rounded-lg px-4 mt-4">
              <span className="font-semibold">實際到帳金額</span>
              <span className="text-2xl font-bold text-primary">
                ${actualAmount.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 操作按鈕 */}
        <div className="flex gap-4 mt-8">
          <Button variant="outline" className="flex-1" onClick={() => router.back()}>
            返回
          </Button>
          <Button className="flex-1" size="lg" onClick={handleContinue}>
            下一步：確認合約
          </Button>
        </div>
      </div>
    </div>
  );
}
