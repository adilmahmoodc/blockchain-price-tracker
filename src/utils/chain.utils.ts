import { btcApiUrl, ethApiUrl, polygonApiUrl } from "src/config/constants";

export function getApiUrlForChain(chain: string): string {
  switch (chain.toLowerCase()) {
    case 'ethereum':
      return ethApiUrl;
    case 'bitcoin':
      return btcApiUrl;
    case 'polygon':
      return polygonApiUrl;
    // Add more chains as needed
    default:
      throw new Error(`Unsupported chain: ${chain}`);
  }
}