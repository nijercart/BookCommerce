
import { Badge } from "@/components/ui/badge";

interface BookImageProps {
  image: string;
  title: string;
  isOutOfStock: boolean;
}

export function BookImage({ image, title, isOutOfStock }: BookImageProps) {
  return (
    <div className="aspect-[3/4] overflow-hidden bg-muted rounded-lg relative">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
      />
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center sm:backdrop-blur-sm">
          <Badge variant="destructive" className="font-medium text-xs">Out of Stock</Badge>
        </div>
      )}
    </div>
  );
}
