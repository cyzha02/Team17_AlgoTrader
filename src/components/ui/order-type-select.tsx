import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrderType = "market" | "limit";

interface OrderTypeSelectProps {
  value: OrderType;
  onChange: (value: OrderType) => void;
}

export function OrderTypeSelect({ value, onChange }: OrderTypeSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(value: string) => onChange(value as OrderType)}
    >
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Select order type" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="market">Market Order</SelectItem>
        <SelectItem value="limit">Limit Order</SelectItem>
      </SelectContent>
    </Select>
  );
}
