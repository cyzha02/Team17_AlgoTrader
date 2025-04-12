import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { OrderTypeSelect } from "./order-type-select";

type OrderType = "market" | "limit";

interface InputWithButtonProps {
  name: string;
  onSubmit: (value: string, orderType: OrderType, limitPrice?: string) => void;
  className?: string;
}

export function InputWithButton({
  name,
  onSubmit,
  className,
}: InputWithButtonProps) {
  const [value, setValue] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [limitPrice, setLimitPrice] = useState("");

  const handleSubmit = () => {
    onSubmit(value, orderType, orderType === "limit" ? limitPrice : undefined);
  };

  return (
    <div className="flex flex-col w-full max-w-sm space-y-2">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Value"
          className="bg-white"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button type="submit" onClick={handleSubmit} className={className}>
          {name}
        </Button>
      </div>
      <div className="flex space-x-2">
        <OrderTypeSelect value={orderType} onChange={setOrderType} />
        {orderType === "limit" && (
          <Input
            type="text"
            placeholder="Limit Price"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            className="bg-white"
          />
        )}
      </div>
    </div>
  );
}
