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
        <Card className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer bg-card border border-border/40 rounded-xl group">
          <BookBadges 
            isPopular={book.isPopular} 
            hasDiscount={hasDiscount} 
            discountPercent={discountPercent} 
          />
          
          <BookImage 
            image={book.image} 
            title={book.title} 
            isOutOfStock={cartQuantity >= book.inStock} 
          />
          
          <div className="p-3 space-y-2.5">
            <BookInfo
              condition={book.condition}
              rating={book.rating}
              title={book.title}
              author={book.author}
              description={book.description}
            />
            
            <div className="flex items-center justify-between">
              <div className="font-semibold text-base text-foreground">
                ৳{book.price.toFixed(2)}
                {hasDiscount && (
                  <span className="ml-1.5 text-xs text-muted-foreground line-through font-normal">
                    ৳{book.originalPrice?.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {book.inStock} left
              </div>
            </div>
            
            <BookActions
              book={book}
              cartQuantity={cartQuantity}
              onAddToCart={handleAddToCart}
            />
          </div>
        </Card>
      </DialogTrigger>
    </BookDialog>
  );
}
