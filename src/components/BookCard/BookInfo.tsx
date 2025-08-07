
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface BookInfoProps {
  condition: "new" | "old";
  rating: number;
  title: string;
  author: string;
  description?: string;
}

export function BookInfo({ condition, rating, title, author, description }: BookInfoProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Badge 
          variant={condition === "new" ? "default" : "secondary"} 
          className="text-[9px] px-1.5 py-0.5 font-medium rounded-md"
        >
          {condition === "new" ? "NEW" : "USED"}
        </Badge>
        <div className="flex items-center gap-0.5">
          <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
          <span className="text-[10px] font-medium text-muted-foreground">{rating}</span>
        </div>
      </div>
      
      <CardTitle className="text-sm font-medium line-clamp-2 leading-tight text-foreground">
        {title}
      </CardTitle>
      
      <p className="text-xs text-muted-foreground line-clamp-1">{author}</p>
      
      {description && (
        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

