
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
    <div className="flex gap-3 w-full">
      <Button 
        size="default" 
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart();
        }}
        disabled={isOutOfStock}
        className="flex-1 h-10 font-medium bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg"
      >
        {isOutOfStock ? "Out of Stock" : 
         cartQuantity > 0 ? `In Cart (${cartQuantity})` : "Add to Cart"}
      </Button>
      
      <BuyNowButton 
        book={book}
        variant="default"
        size="default"
        className="flex-1 h-10 font-medium bg-blue-500 hover:bg-blue-600 text-white border-0 rounded-lg"
      />
    </div>
  );
}
