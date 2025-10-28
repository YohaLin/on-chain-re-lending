"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Lock, FileSignature, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const processingSteps = [
  { id: 1, label: "正在處理您的借款申請...", icon: Loader2 },
  { id: 2, label: "正在鎖定您的數位資產...", icon: Lock },
  { id: 3, label: "合約即將生效...", icon: FileSignature },
  { id: 4, label: "完成！", icon: CheckCircle2 },
];

export default function LoanProcessing() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loanData, setLoanData] = useState<any>(null);

  useEffect(() => {
    // Retrieve loan data from sessionStorage
    if (typeof window !== 'undefined') {
      const data = sessionStorage.getItem('loanData');
      if (data) {
        setLoanData(JSON.parse(data));
      } else {
        router.push("/my-assets");
        return;
      }
    }
  }, [router]);

  useEffect(() => {
    if (!loanData) return;

    // 模擬處理進度
    const stepDuration = 1500; // 每步1.5秒
    const progressInterval = 50; // 每50ms更新一次進度條
    const progressIncrement = 100 / ((stepDuration * processingSteps.length) / progressInterval);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + progressIncrement;
        if (next >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return next;
      });
    }, progressInterval);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < processingSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepTimer);
        // 完成後跳轉到成功頁面
        setTimeout(() => {
          router.push("/loan-success");
        }, 1000);
        return prev;
      });
    }, stepDuration);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, [loanData, router]);

  if (!loanData) {
    return null;
  }

  const { asset, loanAmount } = loanData;
  const CurrentIcon = processingSteps[currentStep].icon;
  const isComplete = currentStep === processingSteps.length - 1;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-2">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-8">
              {/* 動畫圖標 */}
              <div className="flex justify-center">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center ${
                    isComplete
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground animate-pulse"
                  }`}
                >
                  <CurrentIcon className={`w-12 h-12 ${!isComplete && "animate-spin"}`} />
                </div>
              </div>

              {/* 當前步驟文字 */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  {processingSteps[currentStep].label}
                </h2>
                <p className="text-sm text-muted-foreground">
                  請稍候，這可能需要幾秒鐘
                </p>
              </div>

              {/* 進度條 */}
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {Math.round(progress)}% 完成
                </p>
              </div>

              {/* 步驟指示器 */}
              <div className="flex justify-center gap-2">
                {processingSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index <= currentStep
                        ? "bg-primary w-8"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 資產資訊預覽 */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>正在處理抵押資產：{asset.name}</p>
          <p>借款金額：${loanAmount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
