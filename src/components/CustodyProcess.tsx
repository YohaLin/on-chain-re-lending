import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Gem, 
  ArrowRight, 
  Phone, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  FileCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustodyProcessProps {
  onComplete: () => void;
}

type AssetType = "real-estate" | "valuables";
type ProcessStage = "intro" | "method-selection" | "tracking" | "complete";

const CustodyProcess = ({ onComplete }: CustodyProcessProps) => {
  const [assetType] = useState<AssetType>("real-estate"); // 可根據實際資產動態設定
  const [stage, setStage] = useState<ProcessStage>("intro");
  const [selectedMethod, setSelectedMethod] = useState<"pickup" | "delivery" | null>(null);
  const [trackingStatus, setTrackingStatus] = useState("pending");
  const { toast } = useToast();

  const handleStartProcess = () => {
    if (assetType === "real-estate") {
      // 房地產直接進入抵押設定流程
      setStage("tracking");
      simulateProgress();
    } else {
      // 貴重物品進入方式選擇
      setStage("method-selection");
    }
  };

  const handleMethodSelection = (method: "pickup" | "delivery") => {
    setSelectedMethod(method);
    toast({
      title: method === "pickup" ? "已預約專人取件" : "已確認親送預約",
      description: "我們將盡快與您聯繫確認詳細時間",
    });
    setStage("tracking");
    simulateProgress();
  };

  const simulateProgress = () => {
    // 模擬進度更新
    setTimeout(() => setTrackingStatus("in-transit"), 2000);
    setTimeout(() => setTrackingStatus("inspecting"), 4000);
    setTimeout(() => setTrackingStatus("completed"), 6000);
    setTimeout(() => setStage("complete"), 6500);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { icon: Clock, text: "處理中", color: "text-yellow-500" };
      case "in-transit":
        return { icon: Truck, text: "運送中", color: "text-blue-500" };
      case "inspecting":
        return { icon: FileCheck, text: "檢驗中", color: "text-purple-500" };
      case "completed":
        return { icon: CheckCircle2, text: "已完成", color: "text-green-500" };
      default:
        return { icon: Clock, text: "準備中", color: "text-gray-500" };
    }
  };

  // 引導首頁
  if (stage === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              {assetType === "real-estate" ? (
                <Building2 className="w-8 h-8 text-primary" />
              ) : (
                <Gem className="w-8 h-8 text-primary" />
              )}
              <Badge variant="secondary">步驟 4</Badge>
            </div>
            <CardTitle className="text-3xl">下一步：完成實體資產託管程序</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">
                {assetType === "real-estate" ? "房地產抵押權設定" : "貴重物品實體移交"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {assetType === "real-estate"
                  ? "我們已為您指派專業的法律專員與代書，將協助您完成所有抵押權設定的法律程序。這是確保資產合法託管的重要環節。"
                  : "請選擇您偏好的實體資產移交方式。我們提供到府取件或親送至託管中心兩種選擇，確保您的貴重物品安全送達專業託管機構。"}
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium mb-1">為什麼需要這個步驟？</p>
                  <p className="text-sm text-muted-foreground">
                    實體資產的合法託管或抵押權設定是 RWA 代幣化的核心要求。
                    這確保了您的數位資產 NFT 具有真實的法律效力與實體支撐。
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleStartProcess}
              size="lg"
              className="w-full"
            >
              開始辦理
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 方式選擇（僅貴重物品）
  if (stage === "method-selection") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-3xl w-full">
          <CardHeader>
            <CardTitle className="text-2xl">選擇您偏好的移交方式</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Card 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleMethodSelection("pickup")}
              >
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Truck className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">預約專人到府取件</h3>
                      <p className="text-sm text-muted-foreground">
                        專業物流團隊將於您指定的時間上門收取資產
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>選擇日期時間</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleMethodSelection("delivery")}
              >
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <MapPin className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">自行親送至託管中心</h3>
                      <p className="text-sm text-muted-foreground">
                        直接將資產送達我們的專業託管中心
                      </p>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">台北市信義區信義路五段 7 號</p>
                      <p className="text-muted-foreground">週一至週五 09:00-18:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 進度追蹤
  if (stage === "tracking") {
    const statusInfo = getStatusInfo(trackingStatus);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-2xl">託管進度追蹤</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-4">
                <div className={`w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto ${statusInfo.color}`}>
                  <StatusIcon className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-2xl font-semibold mb-2">{statusInfo.text}</p>
                  <p className="text-muted-foreground">
                    {trackingStatus === "completed" 
                      ? "您的資產已成功完成託管程序"
                      : "我們正在處理您的資產託管作業"}
                  </p>
                </div>
              </div>
            </div>

            {assetType === "real-estate" && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-0.5 text-primary" />
                  <div>
                    <p className="font-medium mb-1">您的專屬法律專員</p>
                    <p className="text-sm text-muted-foreground mb-2">李專員 - 資深地政士</p>
                    <p className="text-sm">聯絡電話：02-2345-6789</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {["處理中", "運送中", "檢驗中", "已完成"].map((step, idx) => {
                const isActive = 
                  (idx === 0 && trackingStatus === "pending") ||
                  (idx === 1 && trackingStatus === "in-transit") ||
                  (idx === 2 && trackingStatus === "inspecting") ||
                  (idx === 3 && trackingStatus === "completed");
                const isCompleted = 
                  (idx === 0 && ["in-transit", "inspecting", "completed"].includes(trackingStatus)) ||
                  (idx === 1 && ["inspecting", "completed"].includes(trackingStatus)) ||
                  (idx === 2 && trackingStatus === "completed") ||
                  (idx === 3 && trackingStatus === "completed");

                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      isCompleted ? "bg-green-500 border-green-500" :
                      isActive ? "bg-primary border-primary" :
                      "border-muted-foreground/30"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <span className={`text-sm ${isActive ? "text-white" : "text-muted-foreground"}`}>
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <span className={isActive || isCompleted ? "font-medium" : "text-muted-foreground"}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 託管完成
  if (stage === "complete") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center">實體託管完成！</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-lg text-muted-foreground">
              恭喜您！您的資產已成功完成實體託管程序
            </p>

            <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg space-y-3">
              <p className="font-semibold text-lg">下一步：鑄造資產 NFT</p>
              <p className="text-muted-foreground">
                我們即將為您的資產鑄造獨一無二的數位憑證 (NFT)。
                這個 NFT 將代表您對實體資產的所有權，並可在區塊鏈上進行交易與借貸。
              </p>
            </div>

            <Button 
              onClick={onComplete}
              size="lg"
              className="w-full"
            >
              開始鑄造我的資產 NFT
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default CustodyProcess;
