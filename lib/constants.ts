import { Network } from "./types";

export const SUPPORTED_NETWORKS: Network[] = [
  {
    id: 1,
    name: "Ethereum",
    symbol: "ETH",
    rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/",
    blockExplorer: "https://etherscan.io",
  },
  {
    id: 56,
    name: "BNB Chain",
    symbol: "BNB",
    rpcUrl: "https://bsc-dataseed.binance.org",
    blockExplorer: "https://bscscan.com",
  },
  {
    id: 137,
    name: "Polygon",
    symbol: "MATIC",
    rpcUrl: "https://polygon-rpc.com",
    blockExplorer: "https://polygonscan.com",
  },
  {
    id: 42161,
    name: "Arbitrum",
    symbol: "ETH",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    blockExplorer: "https://arbiscan.io",
  },
];

export const POPULAR_TOKENS = [
  { symbol: "ETH", name: "Ethereum", decimals: 18 },
  { symbol: "BTC", name: "Bitcoin", decimals: 8 },
  { symbol: "USDT", name: "Tether", decimals: 6 },
  { symbol: "USDC", name: "USD Coin", decimals: 6 },
  { symbol: "BNB", name: "BNB", decimals: 18 },
  { symbol: "MATIC", name: "Polygon", decimals: 18 },
];

export const COINGECKO_IDS: Record<string, string> = {
  ETH: "ethereum",
  BTC: "bitcoin",
  USDT: "tether",
  USDC: "usd-coin",
  BNB: "binancecoin",
  MATIC: "matic-network",
};
