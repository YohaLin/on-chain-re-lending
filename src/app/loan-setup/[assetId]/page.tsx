"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Info } from "lucide-react";
import realEstateImage from "@/assets/real-estate-building.png";

// 估值資料介面
interface ValuationData {
  estimatedValue: number;
  valuationData?: {
    matchCount: number;
    priceRange: {
      min: number;
      max: number;
    };
    recentTransactions: any[];
  };
  assetName: string;
  assetType: string;
  assetAddress: string;
}

// 模擬資產數據（作為預設值）
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
  const assetId = params?.assetId as string;

  // 從 sessionStorage 讀取估值資料
  const [valuationData, setValuationData] = useState<ValuationData | null>(null);
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [selectedTerm, setSelectedTerm] = useState(180);

  // 在組件載入時讀取估值資料
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("assetValuation");
      if (storedData) {
        const data: ValuationData = JSON.parse(storedData);
        setValuationData(data);
        // 更新初始借款金額為估值的 50%
        const initialLoan = Math.min(data.estimatedValue * 0.5, data.estimatedValue * 0.6);
        setLoanAmount(Math.round(initialLoan / 100000) * 100000); // 四捨五入到最近的 100,000
      }
    }
  }, []);

  // 使用實際估值或預設值
  const assetValuation = valuationData?.estimatedValue || mockAsset.valuation;
  const assetName = valuationData?.assetName || mockAsset.name;
  const assetType = valuationData?.assetType || mockAsset.type;

  const maxLoanAmount = assetValuation * mockAsset.maxLTV;

  // 計算利息和實際到帳金額
  const calculateInterest = (principal: number, days: number) => {
    return Math.round(principal * ANNUAL_RATE * (days / 365));
  };

  const interest = calculateInterest(loanAmount, selectedTerm);
  const actualAmount = loanAmount - interest;

  const handleContinue = () => {
    // 使用 sessionStorage 傳遞狀態
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "loanData",
        JSON.stringify({
          asset: {
            ...mockAsset,
            name: assetName,
            type: assetType,
            valuation: assetValuation,
          },
          loanAmount,
          selectedTerm,
          interest,
          actualAmount,
          valuationData: valuationData?.valuationData, // 保留詳細估值資料
        })
      );
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
            <div className="space-y-4">
              <div className="w-full aspect-[16/9] rounded-lg overflow-hidden bg-muted relative">
                <Image
                  src={mockAsset.image}
                  alt={mockAsset.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="mb-2">
                  <h3 className="font-semibold text-lg mb-2">
                    {assetName}
                  </h3>
                  <Badge>{assetType}</Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">資產估值</span>
                    <span className="font-semibold">
                      NT$ {assetValuation.toLocaleString()}
                    </span>
                  </div>
                  {valuationData?.valuationData && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>估值來源</span>
                      <span>
                        基於 {valuationData.valuationData.matchCount} 筆實價登錄資料
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">最高可貸額度</span>
                    <span className="font-semibold text-primary">
                      NT$ {maxLoanAmount.toLocaleString()} (60%)
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
                NT$ {loanAmount.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                最高可借 NT$ {maxLoanAmount.toLocaleString()}
              </p>
            </div>
            <Slider
              value={[loanAmount]}
              onValueChange={(value: any) => setLoanAmount(value[0])}
              min={100000}
              max={Math.min(maxLoanAmount, assetValuation)} // 不能超過估值
              step={100000}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>NT$ 100,000</span>
              <span>NT$ {Math.min(maxLoanAmount, assetValuation).toLocaleString()}</span>
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
                NT$ {loanAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">
                預扣總利息 ({(ANNUAL_RATE * 100).toFixed(1)}% 年利率)
              </span>
              <span className="text-xl font-semibold text-destructive">
                -NT$ {interest.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">借款期限</span>
              <span className="text-xl font-semibold">{selectedTerm} 天</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-primary/10 rounded-lg px-4 mt-4">
              <span className="font-semibold">實際到帳金額</span>
              <span className="text-2xl font-bold text-primary">
                NT$ {actualAmount.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 操作按鈕 */}
        <div className="flex gap-4 mt-8">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
          >
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
