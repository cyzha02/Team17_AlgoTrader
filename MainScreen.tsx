import React, { useState, useEffect } from "react";
import { fetchStockHistory, StockData } from "./src/ApiCalls/StockHistory";
import { LineChart } from "@/components/ui/linechart";


const Home: React.FC = () => {
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
      <h1>Welcome to AlgoTrader</h1>
      <p>Your algorithmic trading platform</p>
      <LineChart data={stockData} />
    </div>
  );
};

export default Home;