import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
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

export function LineChart({ data }:LineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>HACK Stock History</CardTitle>
        <CardDescription>
          Historical price data for HACK
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
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
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
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
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Stock Price History
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
