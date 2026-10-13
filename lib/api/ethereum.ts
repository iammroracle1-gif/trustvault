const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export async function getEthereumBalance(address: string): Promise<string | null> {
  if (!ALCHEMY_API_KEY) {
    console.warn("Alchemy API key not configured");
    return null;
  }

  try {
    const response = await fetch(
      `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getBalance",
          params: [address, "latest"],
        }),
      }
    );

    const data = await response.json();
    if (data.error) {
      console.error("Ethereum RPC error:", data.error);
      return null;
    }

    // Convert hex to decimal and wei to ETH
    const balanceWei = parseInt(data.result, 16);
    const balanceEth = balanceWei / 1e18;
    return balanceEth.toFixed(6);
  } catch (error) {
    console.error("Error fetching Ethereum balance:", error);
    return null;
  }
}

export async function getTransactionHistory(
  address: string,
  limit = 10
): Promise<any[]> {
  if (!ALCHEMY_API_KEY) {
    return [];
  }

  try {
    const response = await fetch(
      `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "alchemy_getAssetTransfers",
          params: [
            {
              fromAddress: address,
              toAddress: address,
              category: ["external", "internal", "erc20"],
              maxCount: `0x${limit.toString(16)}`,
              order: "desc",
            },
          ],
        }),
      }
    );

    const data = await response.json();
    return data.result?.transfers || [];
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return [];
  }
}

export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
