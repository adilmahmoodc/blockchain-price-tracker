export const wrappedEthTokenAddress =
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
export const wrappedPolygonTokenAddress =
  '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270';
export const wrappedBtcTokenAddress =
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';

export const ethApiUrl = `https://deep-index.moralis.io/api/v2.2/erc20/${wrappedEthTokenAddress}/price?chain=eth`;
export const btcApiUrl = `https://deep-index.moralis.io/api/v2.2/erc20/${wrappedBtcTokenAddress}/price?chain=eth`;
export const polygonApiUrl = `https://deep-index.moralis.io/api/v2.2/erc20/${wrappedPolygonTokenAddress}/price?chain=polygon`;
