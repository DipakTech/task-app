import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface IProps {
  show: boolean;
  wrapperClass?: string;
  loaderClass?: string;
}

export function Loader({ show, wrapperClass, loaderClass }: IProps) {
  if (!show) {
    return null;
  }

  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center",
        wrapperClass,
      )}
    >
      <Loader2
        className={cn("animate-spin w-5 h-5 text-primary", loaderClass)}
      />
    </div>
  );
}
