export interface Token {
  symbol: string;
  name: string;
  address?: string;
  balance: string;
  value: number;
  change24h: number;
  price: number;
  decimals: number;
  logoUrl?: string;
}

export interface Transaction {
  hash: string;
  type: "send" | "receive" | "swap" | "approval";
  asset: string;
  amount: string;
  value: number;
  from: string;
  to: string;
  timestamp: number;
  status: "pending" | "completed" | "failed";
  blockNumber?: number;
  gasUsed?: string;
}

export interface Network {
  id: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  blockExplorer: string;
  iconUrl?: string;
}

export interface Wallet {
  address: string;
  balance: number;
  tokens: Token[];
  transactions: Transaction[];
  network: Network;
  isViewOnly: boolean;
}

export interface PriceData {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}
