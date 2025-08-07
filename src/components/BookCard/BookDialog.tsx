
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star, Heart } from "lucide-react";
import { BuyNowButton } from "../BuyNowButton";
import { Book } from "@/lib/bookData";

interface BookDialogProps {
  book: Book;
  cartQuantity: number;
  isWishlisted: boolean;
  onAddToCart: () => void;
  onWishlistToggle: () => void;
  children: React.ReactNode;
}

export function BookDialog({ book, cartQuantity, isWishlisted, onAddToCart, onWishlistToggle, children }: BookDialogProps) {
  return (
    <Dialog>
      {children}
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {book.title}
          </DialogTitle>
          <DialogDescription>
            by {book.author}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-[3/4] overflow-hidden bg-muted rounded-lg">
              <img 
                src={book.image} 
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={book.condition === "new" ? "default" : "secondary"}>
                {book.condition === "new" ? "New" : "Pre-owned"}
              </Badge>
              {book.isPopular && (
                <Badge className="bg-accent text-accent-foreground">
                  Popular
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < book.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">({book.rating})</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {book.description || "No description available."}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Genre:</span>
                <p className="text-muted-foreground">{book.genre}</p>
              </div>
              <div>
                <span className="font-medium">Pages:</span>
                <p className="text-muted-foreground">{book.pages}</p>
              </div>
              <div>
                <span className="font-medium">Publisher:</span>
                <p className="text-muted-foreground">{book.publisher}</p>
              </div>
              <div>
                <span className="font-medium">Year:</span>
                <p className="text-muted-foreground">{book.publishedYear}</p>
              </div>
              {book.isbn && (
                <div className="col-span-2">
                  <span className="font-medium">ISBN:</span>
                  <p className="text-muted-foreground">{book.isbn}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">৳{book.price}</span>
                {book.originalPrice && book.originalPrice > book.price && (
                  <span className="text-sm text-muted-foreground line-through">৳{book.originalPrice}</span>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart();
                  }}
                  disabled={cartQuantity >= book.inStock}
                  className="flex-1"
                >
                  {cartQuantity >= book.inStock ? "Out of Stock" : 
                   cartQuantity > 0 ? `In Cart (${cartQuantity})` : "Add to Cart"}
                </Button>
                
                <BuyNowButton 
                  book={book}
                  variant="outline"
                  className="flex-1"
                />
                
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onWishlistToggle();
                  }}
                  className={isWishlisted ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
