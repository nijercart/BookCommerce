import { Button } from "@/components/ui/button";
import { BuyNowButton } from "../BuyNowButton";
import { Book } from "@/lib/bookData";
interface BookActionsProps {
  book: Book;
  cartQuantity: number;
  onAddToCart: () => void;
}
export function BookActions({
  book,
  cartQuantity,
  onAddToCart
}: BookActionsProps) {
  const isOutOfStock = cartQuantity >= book.inStock;
  return (
    <div className="flex flex-col gap-2 w-full p-3 pt-0">
      <Button 
        size="sm" 
        variant={cartQuantity > 0 ? "default" : "outline"} 
        onClick={e => {
          e.stopPropagation();
          onAddToCart();
        }} 
        disabled={isOutOfStock} 
        className="w-full text-xs font-semibold h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white border-0"
      >
        {isOutOfStock ? "Out of Stock" : cartQuantity > 0 ? `In Cart (${cartQuantity})` : "Add to Cart"}
      </Button>
      
      <BuyNowButton 
        book={book} 
        variant="default" 
        size="sm" 
        className="w-full text-xs font-semibold h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white border-0" 
      />
    </div>
  );
}