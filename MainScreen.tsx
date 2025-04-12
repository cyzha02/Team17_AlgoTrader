import React, { useState, useEffect } from "react";
import { fetchStockHistory, StockData } from "./src/ApiCalls/StockHistory";
import { LineChart } from "@/components/ui/linechart";
import { InputWithButton } from "@/components/ui/inputwithbutton";
import { useState } from "react";


const Home: React.FC = () => {
  const [buy, setBuy] = useState(0);
  const [sell, setSell] = useState(0);

  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStockHistory();
        setStockData(data);
      } catch (error) {
        setError('Error fetching stock data');
      } finally {
        setLoading(false);  
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="home-container">
      <h1>HACK Stock AI</h1>
      <p>Algorithmic trading platform</p>
      <LineChart data={stockData} />
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