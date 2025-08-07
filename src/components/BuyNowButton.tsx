
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Book } from "@/lib/bookData";

interface BuyNowButtonProps {
  book: Book;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function BuyNowButton({ book, variant = "secondary", size = "sm", className }: BuyNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (book.inStock <= 0) {
      toast({
        title: "Out of stock",
        description: "This book is currently out of stock.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Store the buy now item in session storage for the payment page
      const buyNowItem = {
        book,
        quantity: 1,
        isBuyNow: true
      };
      
      sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
      
      // Navigate to payment page
      navigate('/payment?mode=buynow');
      
      toast({
        title: "Proceeding to checkout",
        description: `Taking you to checkout for ${book.title}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBuyNow}
      disabled={book.inStock <= 0 || isLoading}
      className={className}
    >
      <ShoppingBag className="h-4 w-4 mr-1" />
      {isLoading ? "Processing..." : "Buy Now"}
    </Button>
  );
}
