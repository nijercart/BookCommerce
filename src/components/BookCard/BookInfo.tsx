
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
    <div className="space-y-2 p-3">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} 
          />
        ))}
        <span className="text-xs font-medium text-muted-foreground ml-1">{rating}</span>
      </div>
      
      <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight text-foreground">
        {title}
      </CardTitle>
      
      <p className="text-xs text-muted-foreground line-clamp-1">{author}</p>
    </div>
  );
}

