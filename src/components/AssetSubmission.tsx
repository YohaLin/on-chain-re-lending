import { useState, useRef } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, CheckCircle2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import jewelryRing from "@/assets/jewelry-ring.png";
import realEstateBuilding from "@/assets/real-estate-building.png";
import artPainting from "@/assets/art-painting.png";
import carVehicle from "@/assets/car-vehicle.png";
import wineBottle from "@/assets/wine-bottle.png";

type AssetType = "real-estate" | "art" | "jewelry" | "vehicle" | "other";

interface AssetData {
  name: string;
  description: string;
  address: string;
  assetType: string;
}

interface AssetSubmissionProps {
  onSubmitSuccess: (data: AssetData) => void;
}

const assetTypes = [
  { id: "real-estate", name: "房地產", image: realEstateBuilding, color: "bg-gradient-to-br from-blue-500 to-blue-600" },
  { id: "art", name: "藝術品", image: artPainting, color: "bg-gradient-to-br from-purple-500 to-purple-600" },
  { id: "jewelry", name: "珠寶首飾", image: jewelryRing, color: "bg-gradient-to-br from-pink-500 to-pink-600" },
  { id: "vehicle", name: "車輛", image: carVehicle, color: "bg-gradient-to-br from-green-500 to-green-600" },
  { id: "other", name: "其他資產", image: wineBottle, color: "bg-gradient-to-br from-orange-500 to-orange-600" },
];

export default function AssetSubmission({ onSubmitSuccess }: AssetSubmissionProps) {
  const [selectedType, setSelectedType] = useState<AssetType | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [assetDescription, setAssetDescription] = useState("");
  const [assetAddress, setAssetAddress] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleTypeSelect = (type: AssetType) => {
    setSelectedType(type);
    setShowDetails(true);
  };

  const handleBack = () => {
    setShowDetails(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => {
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
        const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
        return isValidSize && isValidType;
      });
      
      if (validFiles.length !== newFiles.length) {
        toast({
          title: "部分文件無效",
          description: "請確保文件小於 10MB 且格式為 JPG、PNG 或 PDF",
          variant: "destructive",
        });
      }
      
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedType || !assetName || !assetDescription || !assetAddress || files.length === 0) {
      toast({
        title: "請填寫所有必填欄位",
        description: "請選擇資產類型、填寫資產名稱、描述、地址，並上傳至少一個文件",
        variant: "destructive",
      });
      return;
    }

    // 找到資產類型的中文名稱
    const assetTypeName = assetTypes.find(type => type.id === selectedType)?.name || selectedType;

    toast({
      title: "資產提交成功！",
      description: "您的資產正在審核中，預計需要 1-3 個工作天",
    });

    setTimeout(() => {
      // 將資產數據回傳給父組件
      onSubmitSuccess({
        name: assetName,
        description: assetDescription,
        address: assetAddress,
        assetType: assetTypeName,
      });
    }, 1500);
  };

  if (showDetails && selectedType) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="hover:bg-accent"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold text-foreground">資產詳細資訊</h2>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary">
                您選擇了「{assetTypes.find(t => t.id === selectedType)?.name}」類別
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="asset-name">資產名稱 *</Label>
                <Input
                  id="asset-name"
                  placeholder="請輸入資產名稱"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="asset-description">資產描述 *</Label>
                <Textarea
                  id="asset-description"
                  placeholder="請詳細描述您的資產，包括規格、狀況、特點等"
                  value={assetDescription}
                  onChange={(e) => setAssetDescription(e.target.value)}
                  className="mt-2 min-h-32"
                />
              </div>

              <div>
                <Label htmlFor="asset-address">資產地址 *</Label>
                <AddressAutocomplete
                  id="asset-address"
                  placeholder="請輸入資產地址"
                  value={assetAddress}
                  onChange={setAssetAddress}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>上傳證明文件 *</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  支援 JPG、PNG、PDF 格式，單檔限制 10MB
                </p>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">點擊上傳文件</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      或拖放文件至此處
                    </p>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">已上傳的文件：</p>
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-secondary p-3 rounded-lg"
                      >
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          移除
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            size="lg"
          >
            提交審核
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">選擇資產類型</h2>
        <p className="text-muted-foreground">請選擇您要代幣化的資產類別</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assetTypes.map((type) => {
          return (
            <Card
              key={type.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary border-2 border-transparent rounded-2xl"
              onClick={() => handleTypeSelect(type.id as AssetType)}
            >
              <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center text-center space-y-3 sm:space-y-4">
              <div className="transition-transform hover:scale-110 relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                  <Image src={type.image} alt={type.name} fill className="object-contain z-10" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg">{type.name}</h3>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
