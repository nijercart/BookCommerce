
import { Badge } from "@/components/ui/badge";

interface BookBadgesProps {
  isPopular?: boolean;
  hasDiscount: boolean;
  discountPercent: number;
}

export function BookBadges({ isPopular, hasDiscount, discountPercent }: BookBadgesProps) {
  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
      {isPopular && (
        <Badge className="bg-green-500 text-white text-xs px-2 py-1 font-medium rounded-full">
          Popular
        </Badge>
      )}
      {hasDiscount && (
        <Badge className="bg-red-500 text-white text-xs px-2 py-1 font-medium rounded-full">
          -{discountPercent}%
        </Badge>
      )}
    </div>
  );
}
