export interface ContractConfig {
  address: `0x${string}`;
  chainId: number;
}

export interface ChainConfig {
  id: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
}

// 未來智能合約會給你的 ABI 型別
export type PropertyNFTABI = any[]; // 等收到 ABI 後會自動生成型別
