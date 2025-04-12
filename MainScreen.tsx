import React from "react";
import { LineChart } from "@/components/ui/linechart";
import { InputWithButton } from "@/components/ui/inputwithbutton";
import { useState } from "react";
const Home: React.FC = () => {
  const [buy, setBuy] = useState(0);
  const [sell, setSell] = useState(0);

  return (
    <div className="home-container">
      <h1>HACK Stock AI</h1>
      <p>Algorithmic trading platform</p>
      <LineChart />
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
