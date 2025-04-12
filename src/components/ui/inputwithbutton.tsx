import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InputWithButtonProps {
  name: string;
  onSubmit: () => void;
  className?: string;
}

export function InputWithButton({
  name,
  onSubmit,
  className,
}: InputWithButtonProps) {
  return (
    <div className={`flex w-full max-w-sm items-center space-x-2`}>
      <Input type="text" placeholder="Value" />
      <Button type="submit" onClick={onSubmit} className={className}>
        {name}
      </Button>
    </div>
  );
}
