
import { Button } from "@/components/ui/button";
import { BuyNowButton } from "../BuyNowButton";
import { Book } from "@/lib/bookData";

interface BookActionsProps {
  book: Book;
  cartQuantity: number;
  onAddToCart: () => void;
}

export function BookActions({ book, cartQuantity, onAddToCart }: BookActionsProps) {
  const isOutOfStock = cartQuantity >= book.inStock;
  
  return (
    <div className="flex gap-2 w-full">
      <Button 
        size="sm" 
        variant={cartQuantity > 0 ? "default" : "outline"}
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart();
        }}
        disabled={isOutOfStock}
        className="flex-1 text-xs font-medium h-8"
      >
        {isOutOfStock ? "Out of Stock" : 
         cartQuantity > 0 ? `In Cart (${cartQuantity})` : "Add to Cart"}
      </Button>
      
      <BuyNowButton 
        book={book}
        variant="secondary"
        size="sm"
        className="flex-1 text-xs font-medium h-8"
      />
    </div>
  );
}
