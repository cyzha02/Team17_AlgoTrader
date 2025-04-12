export interface UserInfo {
  user_id: number;
  password: string;
  cash: number;
  open_positions: StockData[];
  profit_loss: number;
  networth: number;
  is_admin: boolean;
}

export interface StockData {
  symbol: string;
  price: number;
  volume: number;
  volatility: number;
  liquidity: number;
  timestamp: string;
}

export const userInfo = async (): Promise<UserInfo> => {
  try {
    const response = await fetch("http://82.29.197.23:8000/accounts/3", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format");
    }
    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

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
