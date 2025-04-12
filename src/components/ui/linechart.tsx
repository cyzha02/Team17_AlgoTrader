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
  const formatInterval = (value: number) => {
    return `${value * 3}s`;
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
            data={data.map((item, index) => ({ ...item, index }))}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="index"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatInterval}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={2}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
              labelFormatter={(value) => `${value * 3}s`}
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
