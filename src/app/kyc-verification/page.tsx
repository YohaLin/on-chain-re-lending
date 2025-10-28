"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Upload, CheckCircle2, Loader2, Camera, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function KYCVerification() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleFileUpload = (type: "id" | "selfie", file: File) => {
    if (type === "id") {
      setIdDocument(file);
      toast({
        title: "文件已上傳",
        description: "身份證件已成功上傳",
      });
    } else {
      setSelfiePhoto(file);
      toast({
        title: "照片已上傳",
        description: "自拍照已成功上傳",
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 驗證所有欄位
    if (!fullName || !idType || !idNumber || !birthDate) {
      toast({
        title: "請填寫所有必填欄位",
        description: "請確保所有基本資料都已填寫",
        variant: "destructive",
      });
      return;
    }

    if (!idDocument || !selfiePhoto) {
      toast({
        title: "請上傳所有必要文件",
        description: "請確保已上傳身份證件和自拍照",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // 模擬提交過程
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "KYC 驗證已提交",
        description: "您的資料已送出審核，即將跳轉到資產類型選擇頁面",
      });

      // 驗證成功後跳轉到資產類型選擇頁面
      setTimeout(() => {
        router.push("/asset-tokenization");
      }, 1500);
    }, 2000);
  };

  const steps = [
    { number: 1, title: "基本資料", icon: FileText },
    { number: 2, title: "上傳文件", icon: Upload },
    { number: 3, title: "完成驗證", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStep >= step.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm mt-2 font-medium">{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 ${
                      currentStep > step.number ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">身份驗證 (KYC)</CardTitle>
            <CardDescription>
              為確保交易安全與合規，請完成身份驗證流程
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">真實姓名</Label>
                    <Input
                      id="fullName"
                      placeholder="請輸入您的真實姓名"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idType">證件類型</Label>
                    <Select value={idType} onValueChange={setIdType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇證件類型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">身份證</SelectItem>
                        <SelectItem value="passport">護照</SelectItem>
                        <SelectItem value="driver">駕照</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idNumber">證件號碼</Label>
                    <Input
                      id="idNumber"
                      placeholder="請輸入證件號碼"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">出生日期</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => {
                      if (!fullName || !idType || !idNumber || !birthDate) {
                        toast({
                          title: "請填寫所有必填欄位",
                          description: "請確保所有基本資料都已填寫完整",
                          variant: "destructive",
                        });
                        return;
                      }
                      setCurrentStep(2);
                    }}
                  >
                    下一步
                  </Button>
                </div>
              )}

              {/* Step 2: Document Upload */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>上傳身份證件</Label>
                    <Card className="border-dashed">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center gap-4">
                          <Upload className="w-12 h-12 text-muted-foreground" />
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              {idDocument ? idDocument.name : "點擊或拖曳上傳證件照片"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              支援 JPG, PNG 格式，檔案大小不超過 10MB
                            </p>
                          </div>
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="id-upload"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload("id", file);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("id-upload")?.click()}
                          >
                            選擇文件
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <Label>上傳手持證件自拍照</Label>
                    <Card className="border-dashed">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center gap-4">
                          <Camera className="w-12 h-12 text-muted-foreground" />
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              {selfiePhoto ? selfiePhoto.name : "點擊或拖曳上傳自拍照"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              請手持證件與臉部一起拍照
                            </p>
                          </div>
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="selfie-upload"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload("selfie", file);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("selfie-upload")?.click()}
                          >
                            選擇文件
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setCurrentStep(1)}
                    >
                      上一步
                    </Button>
                    <Button
                      type="button"
                      className="flex-1"
                      onClick={() => setCurrentStep(3)}
                      disabled={!idDocument || !selfiePhoto}
                    >
                      下一步
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review and Submit */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-muted p-6 rounded-lg space-y-4">
                    <h3 className="font-semibold text-lg">請確認您的資料</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">身份證件：</span>
                        <span className="font-medium">{idDocument?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">自拍照：</span>
                        <span className="font-medium">{selfiePhoto?.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span>⚠️</span>
                      重要提醒
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• 請確保上傳的文件清晰可見</li>
                      <li>• 所有個人資料將被加密保存</li>
                      <li>• 審核通常需要 1-2 個工作天</li>
                      <li>• 審核結果將以郵件方式通知</li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setCurrentStep(2)}
                      disabled={isSubmitting}
                    >
                      上一步
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          提交中...
                        </>
                      ) : (
                        "提交驗證"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
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
              您的個人資料將依據個資法規定嚴格保密，僅用於身份驗證與合規審查，不會分享給第三方。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
