
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
      className={`absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm transition-all duration-200 ${
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
