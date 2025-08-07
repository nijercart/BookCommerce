
import { Badge } from "@/components/ui/badge";

interface BookBadgesProps {
  isPopular?: boolean;
  hasDiscount: boolean;
  discountPercent: number;
}

export function BookBadges({ isPopular, hasDiscount, discountPercent }: BookBadgesProps) {
  return (
    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
      {isPopular && (
        <Badge className="bg-green-500 text-white text-[9px] px-1.5 py-0.5 font-medium rounded-md shadow-sm">
          HOT
        </Badge>
      )}
      {hasDiscount && (
        <Badge className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 font-medium rounded-md shadow-sm">
          -{discountPercent}%
        </Badge>
      )}
    </div>
  );
}
