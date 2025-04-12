import React from "react";
import { LineChart } from "@/components/ui/linechart";
const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>Welcome to AlgoTrader</h1>
      <p>Your algorithmic trading platform</p>
      <LineChart />
    </div>
  );
};

export default Home;
