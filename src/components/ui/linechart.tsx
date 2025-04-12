import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { StockData } from "../../ApiCalls/StockHistory";

interface LineChartProps {
  data: StockData[];
}

export function LineChart({ data }: LineChartProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>HACK Stock History</CardTitle>
        <CardDescription>Historical price data for HACK</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full flex items-center justify-center">
          <AreaChart
            width={800}
            height={400}
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatTime}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
              labelFormatter={(timestamp) =>
                new Date(timestamp).toLocaleString()
              }
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
          </AreaChart>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2"></div>
        </div>
      </CardFooter>
    </Card>
  );
}
