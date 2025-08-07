
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
        <Badge className="bg-accent text-accent-foreground text-[10px] px-1.5 py-0.5 font-medium">
          Popular
        </Badge>
      )}
      {hasDiscount && (
        <Badge className="bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5 font-medium">
          -{discountPercent}%
        </Badge>
      )}
    </div>
  );
}
