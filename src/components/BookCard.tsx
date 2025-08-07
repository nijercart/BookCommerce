import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { DialogTrigger } from "@/components/ui/dialog";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Book } from "@/lib/bookData";

import { BookBadges } from "./BookCard/BookBadges";
import { WishlistButton } from "./BookCard/WishlistButton";
import { BookImage } from "./BookCard/BookImage";
import { BookInfo } from "./BookCard/BookInfo";
import { BookActions } from "./BookCard/BookActions";
import { BookDialog } from "./BookCard/BookDialog";

export function BookCard(book: Book) {
  const { addItem, getItemQuantity } = useCartStore();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { toast } = useToast();
  const cartQuantity = getItemQuantity(book.id);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(isInWishlist(book.id));
  }, [book.id, isInWishlist]);

  const handleAddToCart = () => {
    if (cartQuantity >= book.inStock) {
      toast({
        title: "Out of stock",
        description: "This book is currently out of stock.",
        variant: "destructive"
      });
      return;
    }

    addItem(book);
    toast({
      title: "Added to cart!",
      description: `${book.title} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to add books to your wishlist.",
        variant: "destructive"
      });
      return;
    }

    if (isWishlisted) {
      const success = await removeFromWishlist(user.id, book.id);
      if (success) {
        setIsWishlisted(false);
        toast({
          title: "Removed from wishlist",
          description: `${book.title} has been removed from your wishlist.`,
        });
      }
    } else {
      const success = await addToWishlist(user.id, book);
      if (success) {
        setIsWishlisted(true);
        toast({
          title: "Added to wishlist!",
          description: `${book.title} has been saved to your wishlist.`,
        });
      } else {
        toast({
          title: "Already in wishlist",
          description: `${book.title} is already in your wishlist.`,
        });
      }
    }
  };

  const hasDiscount = book.originalPrice && book.originalPrice > book.price;
  const discountPercent = hasDiscount ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0;

  return (
    <BookDialog
      book={book}
      cartQuantity={cartQuantity}
      isWishlisted={isWishlisted}
      onAddToCart={handleAddToCart}
      onWishlistToggle={handleWishlistToggle}
    >
      <DialogTrigger asChild>
        <Card className="flex flex-col justify-between h-full min-h-[500px] cursor-pointer group relative bg-card border border-border hover:shadow-lg transition-all duration-200">
          
          <BookBadges 
            isPopular={book.isPopular} 
            hasDiscount={hasDiscount} 
            discountPercent={discountPercent} 
          />
          
          <WishlistButton 
            isWishlisted={isWishlisted} 
            onToggle={handleWishlistToggle} 
          />
          
          <CardHeader className="p-0 flex-shrink-0">
            <BookImage 
              image={book.image} 
              title={book.title} 
              isOutOfStock={cartQuantity >= book.inStock} 
            />
          </CardHeader>
          
          <CardContent className="p-3 flex-grow">
            <BookInfo
              condition={book.condition}
              rating={book.rating}
              title={book.title}
              author={book.author}
              description={book.description}
            />
          </CardContent>
          
          <CardFooter className="p-3 pt-0 flex flex-col gap-3 mt-auto">
            <div className="flex items-center gap-2 w-full">
              <span className="text-lg font-bold text-foreground">৳{book.price}</span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">৳{book.originalPrice}</span>
              )}
            </div>
            
            <BookActions
              book={book}
              cartQuantity={cartQuantity}
              onAddToCart={handleAddToCart}
            />
          </CardFooter>
        </Card>
      </DialogTrigger>
    </BookDialog>
  );
}
