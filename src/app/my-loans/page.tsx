"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, DollarSign, Calendar } from "lucide-react";
import realEstateImage from "@/assets/real-estate-building.png";

// 模擬貸款記錄
const mockLoans = [
  {
    id: "loan-001",
    asset: {
      name: "台北市中正區豪宅",
      image: realEstateImage,
      tokenId: "0x1234...5678",
    },
    loanAmount: 5000000,
    actualReceived: 4750000,
    interest: 250000,
    startDate: new Date("2025-10-28"),
    dueDate: new Date("2026-04-26"),
    termDays: 180,
    status: "active",
  },
];

export default function MyLoans() {
  const router = useRouter();

  const calculateDaysRemaining = (dueDate: Date) => {
    const today = new Date();
    const diff = dueDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateProgress = (startDate: Date, dueDate: Date) => {
    const today = new Date();
    const total = dueDate.getTime() - startDate.getTime();
    const elapsed = today.getTime() - startDate.getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
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
            <h1 className="text-2xl font-bold">我的貸款</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {mockLoans.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">您目前沒有進行中的貸款</p>
              <Button onClick={() => router.push("/my-assets")}>前往借款</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {mockLoans.map((loan) => {
              const daysRemaining = calculateDaysRemaining(loan.dueDate);
              const progress = calculateProgress(loan.startDate, loan.dueDate);
              const isUrgent = daysRemaining <= 30;

              return (
                <Card key={loan.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <div className="flex items-start justify-between">
                      <CardTitle className="flex items-center gap-2">
                        進行中的借貸
                        <Badge variant={isUrgent ? "destructive" : "default"}>
                          {loan.status === "active" ? "進行中" : "已完成"}
                        </Badge>
                      </CardTitle>
                      <Button size="sm">提前還款</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* 抵押資產 */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 relative">
                        <Image
                          src={loan.asset.image}
                          alt={loan.asset.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{loan.asset.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Token ID: {loan.asset.tokenId}
                        </p>
                      </div>
                    </div>

                    {/* 貸款資訊 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <DollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">應還本金</p>
                          <p className="text-lg font-bold">
                            ${loan.loanAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">借款期限</p>
                          <p className="text-lg font-bold">{loan.termDays} 天</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isUrgent ? "bg-destructive/10" : "bg-primary/10"
                          }`}
                        >
                          <Clock
                            className={`w-5 h-5 ${
                              isUrgent ? "text-destructive" : "text-primary"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">剩餘時間</p>
                          <p
                            className={`text-lg font-bold ${
                              isUrgent ? "text-destructive" : ""
                            }`}
                          >
                            {daysRemaining} 天
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 進度條 */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">還款進度</span>
                        <span className="font-semibold">
                          {loan.startDate.toLocaleDateString("zh-TW")} -{" "}
                          {loan.dueDate.toLocaleDateString("zh-TW")}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* 詳細資訊 */}
                    <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">實際到帳金額</span>
                        <span className="font-semibold">
                          ${loan.actualReceived.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">已扣利息</span>
                        <span className="font-semibold">
                          ${loan.interest.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">到期還款日</span>
                        <span className="font-semibold text-destructive">
                          {loan.dueDate.toLocaleDateString("zh-TW")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
