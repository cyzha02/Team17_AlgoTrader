export interface StockData {
  symbol: string;
  price: number;
  volume: number;
  volatility: number;
  liquidity: number;
  timestamp: string;
}

export const fetchStockHistory = async (): Promise<StockData[]> => {
  try {
    const response = await fetch(
      "http://82.29.197.23:8000/stocks/HACK/history",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching stock history:", error);
    throw error;
  }
};
