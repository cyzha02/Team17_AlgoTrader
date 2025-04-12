import React, { useState, useEffect } from "react";
import { fetchStockHistory, StockData } from "../ApiCalls/StockHistory";
import TradingService from "../ApiCalls/TradingService";
import { LineChart } from "@/components/ui/linechart";
import { InputWithButton } from "@/components/ui/inputwithbutton";

const Home: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");

  const fetchUserData = async () => {
    try {
      const accountInfo = await TradingService.getAccountInfo(3);
      console.log("Account Info:", accountInfo);
    } catch {
      setError("Error fetching user data");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const data = await fetchStockHistory();
      setStockData([...data].reverse());
    } catch (error) {
      setError("Error fetching stock data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // set up interval for subsequent fetching every 3 seconds
    const intervalId = setInterval(fetchData, 3000);
    // cleanup to clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleBuy = (
    value: string,
    orderType: "market" | "limit",
    limitPrice?: string
  ) => {
    console.log("Buy order:", { value, orderType, limitPrice });
    // TODO: Implement buy logic
  };

  const handleSell = (
    value: string,
    orderType: "market" | "limit",
    limitPrice?: string
  ) => {
    console.log("Sell order:", { value, orderType, limitPrice });
    // TODO: Implement sell logic
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="home-container">
      <h1 className="text-green-500 font-bold text-4xl">HACK Stock Trader</h1>
      <p className="text-green-500">The algorithmic trading platform</p>
      <div className="relative">
        <LineChart data={stockData} />
      </div>

      <p className="text-green-500">
        Current Price: {stockData[stockData.length - 1]?.price || "N/A"}
      </p>

      <div className="flex flex-col items-center space-y-4">
        <div className="flex flex-row gap-2 justify-center">
          <InputWithButton
            name="Buy"
            onSubmit={handleBuy}
            className="bg-green-500"
          />
          <InputWithButton
            name="Sell"
            onSubmit={handleSell}
            className="bg-red-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
