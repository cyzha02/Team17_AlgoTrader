import React, { useState, useEffect } from "react";
import { fetchStockHistory, StockData } from "./src/ApiCalls/StockHistory";
import { LineChart } from "@/components/ui/linechart";
import { InputWithButton } from "@/components/ui/inputwithbutton";
import { OrderTypeSelect } from "@/components/ui/order-type-select";

const Home: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStockHistory();
        setStockData([...data].reverse());
        console.log("Stock data updated");
      } catch (error) {
        setError("Error fetching stock data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // set up interval for subsequent fetching every 5 seconds
    const intervalId = setInterval(fetchData, 5000);
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

      <LineChart data={stockData} />
      <p className="text-green-500">
        Current Price: {stockData[stockData.length - 1].price}
      </p>
      <p className="text-white text-2xl font-bold">MANUAL TRADE</p>
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
