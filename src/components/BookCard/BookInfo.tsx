
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Badge 
          variant={condition === "new" ? "default" : "secondary"} 
          className="text-[10px] px-2 py-0.5 font-medium"
        >
          {condition === "new" ? "New" : "Pre-owned"}
        </Badge>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium text-muted-foreground">{rating}</span>
        </div>
      </div>
      
      <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
        {title}
      </CardTitle>
      
      <p className="text-xs text-muted-foreground line-clamp-1 font-medium">{author}</p>
      
      {description && (
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
