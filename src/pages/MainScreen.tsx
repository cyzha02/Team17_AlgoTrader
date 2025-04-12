import React, { useState, useEffect, useRef } from "react";
import {
  fetchStockHistory,
  StockData,
  UserInfo,
} from "../ApiCalls/StockHistory";
import TradingService from "../ApiCalls/TradingService";
import { SmaCrossoverStrategy } from "../Algo/SmaCrossoverAlgo";
import { LineChart } from "@/components/ui/linechart";
import { InputWithButton } from "@/components/ui/inputwithbutton";
import { OrderRequest } from "../types/trading";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
  const { userId } = useAuth();
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isAlgoRunning, setIsAlgoRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const algoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const startAlgorithm = async () => {
    if (isAlgoRunning) return;
    setIsAlgoRunning(true);
    addLog("Starting algorithm...");

    // Run algorithm every 30 seconds
    algoIntervalRef.current = setInterval(async () => {
      try {
        addLog("Running algorithm iteration...");
        const result = await SmaCrossoverStrategy.execute("HACK");
        if (result) {
          addLog(`Order placed: ${JSON.stringify(result)}`);
        } else {
          addLog("No trading signal generated");
        }
      } catch (error) {
        addLog(
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }, 10000);

    // Run first iteration immediately
    try {
      const result = await SmaCrossoverStrategy.execute("HACK");
      if (result) {
        addLog(`Initial order placed: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      addLog(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const stopAlgorithm = async () => {
    if (!isAlgoRunning) return;

    // Clear the interval
    if (algoIntervalRef.current) {
      clearInterval(algoIntervalRef.current);
      algoIntervalRef.current = null;
    }

    addLog("Stopping algorithm and liquidating positions...");

    try {
      // Get account info to check positions
      const accountInfo = (await TradingService.getAccountInfo(
        userId!
      )) as UserInfo;

      // Place market sell orders for all positions
      if (accountInfo.open_positions && accountInfo.open_positions.length > 0) {
        for (const position of accountInfo.open_positions) {
          const sellOrder: OrderRequest = {
            user_id: userId!,
            symbol: position.symbol,
            side: "sell" as const,
            quantity: position.volume,
            order_type: "market" as const,
            limit_price: 0,
          };

          const result = await TradingService.placeOrder(sellOrder);
          addLog(`Liquidation order placed: ${JSON.stringify(result)}`);
        }
      }

      setIsAlgoRunning(false);
      addLog("Algorithm stopped and positions liquidated");
    } catch (error) {
      addLog(
        `Error during liquidation: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Combine data fetching into a single function
  const fetchAllData = async () => {
    try {
      setLoading(true);
      if (!userId) {
        throw new Error("User ID not found");
      }

      // Fetch both data in parallel
      const [accountInfo, stockHistoryData] = await Promise.all([
        TradingService.getAccountInfo(userId),
        fetchStockHistory(),
      ]);

      console.log("Account Info:", accountInfo);
      setStockData([...stockHistoryData].reverse());
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Single data fetching
  useEffect(() => {
    if (userId) {
      fetchAllData();

      // Set up interval for subsequent stock data fetching
      const intervalId = setInterval(async () => {
        try {
          const data = await fetchStockHistory();
          setStockData([...data].reverse());
        } catch (error) {
          console.error("Error updating stock data:", error);
          // Don't set error state here to avoid disrupting the UI
        }
      }, 3000);

      // Cleanup function
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [userId]);

  // Separate algorithm cleanup
  useEffect(() => {
    return () => {
      if (algoIntervalRef.current) {
        clearInterval(algoIntervalRef.current);
      }
    };
  }, []);

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

      {/* Algorithm Controls */}
      <div className="flex justify-center gap-4 my-4">
        <button
          onClick={startAlgorithm}
          disabled={isAlgoRunning}
          className={`px-4 py-2 rounded ${
            isAlgoRunning
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Start Algorithm
        </button>
        <button
          onClick={stopAlgorithm}
          disabled={!isAlgoRunning}
          className={`px-4 py-2 rounded ${
            !isAlgoRunning
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          End Algorithm
        </button>
      </div>

      {/* Algorithm Logs */}
      <div className="w-full max-w-3xl mx-auto mb-4 bg-black border border-green-500 rounded">
        <div className="h-40 overflow-y-auto p-4">
          {logs.map((log, index) => (
            <div key={index} className="text-green-500 font-mono text-sm">
              {log}
            </div>
          ))}
        </div>
      </div>

      <p className="text-green-500">
        Current Price: {stockData[stockData.length - 1]?.price || "N/A"}
      </p>
    </div>
  );
};

export default Home;
