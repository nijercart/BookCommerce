
import { Badge } from "@/components/ui/badge";

interface BookImageProps {
  image: string;
  title: string;
  isOutOfStock: boolean;
}

export function BookImage({ image, title, isOutOfStock }: BookImageProps) {
  return (
    <div className="aspect-[3/4] overflow-hidden bg-muted rounded-t-lg relative group">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
          <Badge variant="destructive" className="font-medium">Out of Stock</Badge>
        </div>
      )}
    </div>
  );
}
