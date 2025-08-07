
import { Badge } from "@/components/ui/badge";

interface BookBadgesProps {
  isPopular?: boolean;
  hasDiscount: boolean;
  discountPercent: number;
}

export function BookBadges({ isPopular, hasDiscount, discountPercent }: BookBadgesProps) {
  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
      {isPopular && (
        <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 font-medium rounded-md shadow-sm">
          NEW
        </Badge>
      )}
    </div>
  );
}
