import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import artImage from "@/assets/art-painting.png";
import carImage from "@/assets/car-vehicle.png";
import jewelryImage from "@/assets/jewelry-ring.png";
import realEstateImage from "@/assets/real-estate-building.png";
import wineImage from "@/assets/wine-bottle.png";

// 模擬用戶擁有的NFT資產
const userAssets = [
  {
    id: "nft-001",
    name: "台北市中正區豪宅",
    type: "real_estate",
    image: realEstateImage,
    valuation: 15000000,
    status: "active",
    tokenId: "0x1234...5678",
  },
  {
    id: "nft-002",
    name: "勞力士限量版腕錶",
    type: "jewelry",
    image: jewelryImage,
    valuation: 800000,
    status: "active",
    tokenId: "0x8765...4321",
  },
  {
    id: "nft-003",
    name: "保時捷 911 GT3",
    type: "vehicle",
    image: carImage,
    valuation: 6500000,
    status: "active",
    tokenId: "0xabcd...efgh",
  },
];

const assetTypeNames: Record<string, string> = {
  real_estate: "不動產",
  jewelry: "珠寶",
  vehicle: "車輛",
  art: "藝術品",
  wine: "收藏酒",
};

export default function MyAssets() {
  const navigate = useNavigate();

  const handleStartLoan = (assetId: string) => {
    navigate(`/loan-setup/${assetId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">我的資產</h1>
            <Button variant="outline" onClick={() => navigate("/")}>
              返回首頁
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-muted-foreground">
            您共有 {userAssets.length} 個已代幣化的資產，可用於抵押借款
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userAssets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden bg-muted">
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 right-3 bg-primary">
                  {assetTypeNames[asset.type]}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{asset.name}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">估值</span>
                    <span className="font-semibold">
                      ${asset.valuation.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Token ID</span>
                    <span className="font-mono text-xs">{asset.tokenId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">狀態</span>
                    <Badge variant="outline" className="text-xs">
                      可借款
                    </Badge>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleStartLoan(asset.id)}
                >
                  開始借款
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
