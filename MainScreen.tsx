import React, { useState, useEffect } from "react";
import { fetchStockHistory, StockData } from "./src/ApiCalls/StockHistory";
import { LineChart } from "@/components/ui/linechart";
import { InputWithButton } from "@/components/ui/inputwithbutton";

const Home: React.FC = () => {
  const [buy, setBuy] = useState(0);
  const [sell, setSell] = useState(0);

  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="home-container ">
      <h1 className="text-green-500 font-bold text-4xl">HACK Stock Trader</h1>
      <p className="text-green-500">The algorithmic trading platform</p>

      <LineChart data={stockData} />
      <p className="text-green-500"> Current Price: {stockData[0].price}</p>
      <div className="flex flex-row gap-2 justify-center">
        <InputWithButton
          name="Buy"
          onSubmit={() => {}}
          className="bg-green-500"
        />
        <InputWithButton
          name="Sell"
          onSubmit={() => {}}
          className="bg-red-500"
        />
      </div>
    </div>
  );
};

export default Home;
