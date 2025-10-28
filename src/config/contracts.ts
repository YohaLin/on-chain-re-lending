import type { ContractConfig, ChainConfig } from "@/types/contract";

// 支援的區塊鏈網路
export const supportedChains: ChainConfig[] = [
  {
    id: 11155111, // Sepolia Testnet
    name: "Sepolia",
    rpcUrl: "https://rpc.sepolia.org",
    blockExplorer: "https://sepolia.etherscan.io",
  },
  {
    id: 80001, // Mumbai Testnet (Polygon)
    name: "Mumbai",
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    blockExplorer: "https://mumbai.polygonscan.com",
  },
];

// 智能合約地址配置
// 當工程師給你合約地址後，在這裡填入
export const contracts: Record<number, ContractConfig> = {
  // Sepolia
  11155111: {
    address: "0x0000000000000000000000000000000000000000", // 待填入
    chainId: 11155111,
  },
  // Mumbai
  80001: {
    address: "0x0000000000000000000000000000000000000000", // 待填入
    chainId: 80001,
  },
};

export const getContractAddress = (chainId: number): `0x${string}` => {
  const contract = contracts[chainId];
  if (!contract) {
    throw new Error(`Contract not deployed on chain ${chainId}`);
  }
  return contract.address;
};
