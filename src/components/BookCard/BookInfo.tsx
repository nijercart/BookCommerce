
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Badge 
          variant={condition === "new" ? "default" : "secondary"} 
          className="text-xs px-2 py-1 font-medium rounded-md"
        >
          {condition === "new" ? "New" : "Pre-owned"}
        </Badge>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-600">{rating}</span>
        </div>
      </div>
      
      <CardTitle className="text-base font-semibold line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
        {title}
      </CardTitle>
      
      <p className="text-sm text-gray-600 line-clamp-1 font-medium">{author}</p>
      
      {description && (
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
