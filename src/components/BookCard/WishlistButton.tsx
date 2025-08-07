
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  isWishlisted: boolean;
  onToggle: () => void;
}

export function WishlistButton({ isWishlisted, onToggle }: WishlistButtonProps) {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={`absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-md transition-all duration-200 ${
        isWishlisted ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
    </Button>
  );
}
