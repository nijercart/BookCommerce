
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
    <div className="flex gap-1.5 w-full">
      <Button 
        size="sm" 
        variant={cartQuantity > 0 ? "default" : "outline"}
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart();
        }}
        disabled={isOutOfStock}
        className="flex-1 text-[10px] font-medium h-7 rounded-md"
      >
        {isOutOfStock ? "Out of Stock" : 
         cartQuantity > 0 ? `In Cart (${cartQuantity})` : "Add to Cart"}
      </Button>
      
      <BuyNowButton 
        book={book}
        variant="default"
        size="sm"
        className="flex-1 text-[10px] font-medium h-7 rounded-md bg-blue-600 hover:bg-blue-700 text-white border-0"
      />
    </div>
  );
}
