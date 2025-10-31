"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Shield,
  Upload,
  CheckCircle2,
  Loader2,
  Camera,
  FileText,
  CalendarIcon,
  LogOut,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useDisconnect, useAccount } from "wagmi";

export default function KYCVerification() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<File | null>(null);
  const [idDocumentPreview, setIdDocumentPreview] = useState<string | null>(
    null
  );
  const [selfiePhotoPreview, setSelfiePhotoPreview] = useState<string | null>(
    null
  );
  const [fullName, setFullName] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [birthDate, setBirthDate] = useState<Date>();
  const router = useRouter();
  const { toast } = useToast();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  const handleFileUpload = (type: "id" | "selfie", file: File) => {
    const previewUrl = URL.createObjectURL(file);
    if (type === "id") {
      setIdDocument(file);
      setIdDocumentPreview(previewUrl);
      toast({
        title: "文件已上傳",
        description: "身份證件已成功上傳",
      });
    } else {
      setSelfiePhoto(file);
      setSelfiePhotoPreview(previewUrl);
      toast({
        title: "照片已上傳",
        description: "自拍照已成功上傳",
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "已登出",
      description: "錢包已斷開連接",
    });
    router.push("/");
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
    { number: 2, title: "上傳證件", icon: Upload },
    { number: 3, title: "完成驗證", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col gap-4">
      <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="font-semibold">KYC 驗證</span>
          </div>
          {address && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground font-mono hidden sm:inline">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                登出
              </Button>
            </div>
          )}
        </div>
      </header>
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-start justify-center gap-0">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                      currentStep >= step.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <p className="text-xs sm:text-sm mt-2 font-medium text-center whitespace-nowrap">
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-16 sm:w-24 mx-2 sm:mx-4 ${
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-between text-left font-normal hover:bg-accent hover:text-accent-foreground focus:bg-background focus:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0",
                            !birthDate && "text-muted-foreground"
                          )}
                        >
                          {birthDate ? (
                            format(birthDate, "yyyy/MM/dd")
                          ) : (
                            <span>年 /月/日</span>
                          )}
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={birthDate}
                          onSelect={setBirthDate}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
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
                      <CardContent
                        className={idDocumentPreview ? "p-3" : "p-6"}
                      >
                        <div className="flex flex-col items-center gap-4">
                          {idDocumentPreview ? (
                            <div className="relative w-full max-w-sm aspect-video">
                              <Image
                                src={idDocumentPreview}
                                alt="身份證件預覽"
                                fill
                                className="rounded-lg object-cover"
                              />
                            </div>
                          ) : (
                            <Upload className="w-12 h-12 text-muted-foreground" />
                          )}
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              {idDocument
                                ? idDocument.name
                                : "點擊或拖曳上傳身份證件"}
                            </p>
                            {!idDocument && (
                              <p className="text-xs text-muted-foreground mt-1">
                                支援 JPG, PNG 格式，檔案大小不超過 10MB
                              </p>
                            )}
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
                            onClick={() =>
                              document.getElementById("id-upload")?.click()
                            }
                          >
                            {idDocument ? "變更文件" : "選擇文件"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <Label>上傳手持自拍照</Label>
                    <Card className="border-dashed">
                      <CardContent
                        className={selfiePhotoPreview ? "p-3" : "p-6"}
                      >
                        <div className="flex flex-col items-center gap-4">
                          {selfiePhotoPreview ? (
                            <div className="relative w-full max-w-sm aspect-video">
                              <Image
                                src={selfiePhotoPreview}
                                alt="自拍照預覽"
                                fill
                                className="rounded-lg object-cover"
                              />
                            </div>
                          ) : (
                            <Camera className="w-12 h-12 text-muted-foreground" />
                          )}
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              {selfiePhoto
                                ? selfiePhoto.name
                                : "點擊或拖曳上傳自拍照"}
                            </p>
                            {!selfiePhoto && (
                              <p className="text-xs text-muted-foreground mt-1">
                                請手持證件與臉部一起拍照
                              </p>
                            )}
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
                            onClick={() =>
                              document.getElementById("selfie-upload")?.click()
                            }
                          >
                            {selfiePhoto ? "變更文件" : "選擇文件"}
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
                  <div className="bg-background border p-6 rounded-lg space-y-4">
                    <h3 className="font-semibold text-lg">請確認您的資料</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground whitespace-nowrap">
                          身份證件：
                        </span>
                        <span className="font-medium text-right">
                          {idDocument?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground whitespace-nowrap">
                          自拍照：
                        </span>
                        <span className="font-medium text-right">
                          {selfiePhoto?.name}
                        </span>
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
