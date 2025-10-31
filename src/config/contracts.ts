import type { ContractConfig, ChainConfig } from "@/types/contract";

// 支援的區塊鏈網路
export const supportedChains: ChainConfig[] = [
  {
    id: 23294, // Sapphire Mainnet
    name: "Sapphire",
    rpcUrl: "https://sapphire.oasis.io",
    blockExplorer: "https://explorer.oasis.io/mainnet/sapphire",
  },
  {
    id: 23295, // Sapphire Testnet
    name: "Sapphire Testnet",
    rpcUrl: "https://testnet.sapphire.oasis.io",
    blockExplorer: "https://explorer.oasis.io/testnet/sapphire",
  },
];

// 智能合約地址配置
// PropertyNFT 合約地址
export const contracts: Record<number, ContractConfig> = {
  // Sapphire Mainnet
  23294: {
    address: "0x0000000000000000000000000000000000000000", // 待部署
    chainId: 23294,
  },
  // Sapphire Testnet
  23295: {
    address: "0x077EA4EEB46Fdf1F406E108e52fd463764d73383", // 已部署
    chainId: 23295,
  },
};

export const getContractAddress = (chainId: number): `0x${string}` => {
  const contract = contracts[chainId];
  if (!contract) {
    throw new Error(`Contract not deployed on chain ${chainId}`);
  }
  return contract.address;
};
