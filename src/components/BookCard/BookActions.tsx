
import { Button } from "@/components/ui/button";
import { BuyNowButton } from "../BuyNowButton";
import { Book } from "@/lib/bookData";
import { ShoppingCart } from "lucide-react";

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
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart();
        }}
        disabled={isOutOfStock}
        className="flex-1 text-xs font-medium h-8 px-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700"
      >
        <ShoppingCart className="h-3.5 w-3.5 mr-1" />
        {isOutOfStock ? "Out of Stock" : 
         cartQuantity > 0 ? `In Cart (${cartQuantity})` : "Add to Cart"}
      </Button>
      
      <BuyNowButton 
        book={book}
        variant="default"
        size="sm"
        className="flex-1 text-xs font-medium h-8 px-3 bg-orange-500 hover:bg-orange-600 text-white border-0"
      />
    </div>
  );
}
