export interface Property {
  id: string;
  address: string;
  city: string;
  district: string;
  price: string;
  size: number; // 坪數
  rooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  buildYear: number;
  description?: string;
  images?: string[];
  // 區塊鏈相關
  tokenId?: number;
  contractAddress?: string;
  owner?: string;
  isListed?: boolean;
}

export interface PropertyMetadata {
  landNumber: string; // 地號
  buildingNumber: string; // 建號
  usageZoning: string; // 使用分區
  landRightsType: string; // 土地權利種類
}

export interface PropertyTransaction {
  id: string;
  propertyId: string;
  from: string;
  to: string;
  price: string;
  timestamp: number;
  txHash: string;
}
