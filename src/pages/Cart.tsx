
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/cartStore";
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, Tag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Cart = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems
  } = useCartStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some books to your cart before checking out.",
        variant: "destructive"
      });
      return;
    }
    // Pass applied promo to payment page
    navigate("/payment", { state: { appliedPromo } });
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Please enter a promo code",
        variant: "destructive"
      });
      return;
    }

    setIsApplyingPromo(true);
    
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('status', 'active')
        .single();

      if (error || !data) {
        toast({
          title: "Invalid promo code",
          description: "Please check your code and try again.",
          variant: "destructive"
        });
        return;
      }

      const promo = data;

      // Check if promo code is still valid
      const now = new Date();
      if (promo.valid_until && new Date(promo.valid_until) < now) {
        toast({
          title: "Promo code expired",
          description: "This promo code has expired.",
          variant: "destructive"
        });
        return;
      }

      // Check usage limit
      if (promo.usage_limit && promo.used_count >= promo.usage_limit) {
        toast({
          title: "Promo code limit reached",
          description: "This promo code has reached its usage limit.",
          variant: "destructive"
        });
        return;
      }

      setAppliedPromo(promo);
      toast({
        title: "Promo code applied!",
        description: `You saved ${promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `৳${promo.discount_value}`}`,
      });
    } catch (error) {
      console.error('Error applying promo code:', error);
      toast({
        title: "Error applying promo code",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode("");
    toast({
      title: "Promo code removed",
    });
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    const subtotal = getTotalPrice();
    if (appliedPromo.discount_type === 'percentage') {
      return subtotal * (appliedPromo.discount_value / 100);
    } else {
      return Math.min(appliedPromo.discount_value, subtotal);
    }
  };

  const getFinalTotal = () => {
    const subtotal = getTotalPrice();
    const deliveryCharge = subtotal > 1000 ? 0 : 60;
    const discount = calculateDiscount();
    return subtotal + deliveryCharge - discount;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start building your library by adding some books to your cart.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero">
                <Link to="/new-books">Browse New Books</Link>
              </Button>
              <Button asChild variant="accent">
                <Link to="/old-books">Browse Pre-owned Books</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="bg-card rounded-xl shadow-card p-6 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-10 w-10">
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
              <p className="text-muted-foreground mt-1">
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="border-b border-border p-6">
                <h2 className="text-xl font-semibold">Your Items</h2>
              </div>
              
              <div className="divide-y divide-border">
                {items.map(item => (
                  <div key={item.book.id} className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex gap-6">
                      {/* Book Image */}
                      <div className="w-24 h-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden border border-border/50">
                        <img 
                          src={item.book.image} 
                          alt={item.book.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                        />
                      </div>

                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-foreground">
                              {item.book.title}
                            </h3>
                            <p className="text-muted-foreground mt-1">{item.book.author}</p>
                            <Badge variant={item.book.condition === "new" ? "default" : "secondary"} className="mt-2">
                              {item.book.condition === "new" ? "New" : "Pre-owned"}
                            </Badge>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10" 
                            onClick={() => removeItem(item.book.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>

                        {/* Quantity Controls and Price */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
                            <div className="flex items-center gap-1 border border-border rounded-lg">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-10 w-10 hover:bg-muted" 
                                onClick={() => updateQuantity(item.book.id, item.quantity - 1)} 
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input 
                                type="number" 
                                value={item.quantity} 
                                onChange={(e) => {
                                  const qty = parseInt(e.target.value) || 1;
                                  updateQuantity(item.book.id, Math.max(1, Math.min(qty, item.book.inStock)));
                                }}
                                className="w-16 h-10 text-center border-0 focus-visible:ring-0" 
                                min="1" 
                                max={item.book.inStock} 
                              />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-10 w-10 hover:bg-muted" 
                                onClick={() => updateQuantity(item.book.id, item.quantity + 1)} 
                                disabled={item.quantity >= item.book.inStock}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">৳{(item.book.price * item.quantity).toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">৳{item.book.price} each</div>
                          </div>
                        </div>

                        {item.quantity >= item.book.inStock && (
                          <div className="flex items-center gap-2 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <span className="text-xs text-amber-700 font-medium">
                              Maximum quantity available: {item.book.inStock}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Actions */}
              <div className="p-6 bg-muted/30 border-t border-border">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <Button variant="outline" onClick={clearCart} className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear Cart
                  </Button>
                  <Button variant="ghost" asChild className="flex items-center gap-2">
                    <Link to="/books">
                      <ArrowLeft className="h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-card sticky top-8">
              <div className="border-b border-border p-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  Order Summary
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Pricing Details */}
                <div className="space-y-4">
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Subtotal ({getTotalItems()} items)</span>
                    <span className="font-medium">৳{getTotalPrice().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Delivery Charge</span>
                    <span className="font-medium">
                      {getTotalPrice() > 1000 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        <span>৳{(60).toFixed(2)}</span>
                      )}
                    </span>
                  </div>
                  
                  {getTotalPrice() > 1000 && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                      🎉 You qualify for free delivery!
                    </div>
                  )}
                </div>

                {/* Promo Code Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Promo Code</h3>
                  {!appliedPromo ? (
                    <div className="space-y-3">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="h-11"
                      />
                      <Button 
                        onClick={applyPromoCode}
                        disabled={isApplyingPromo}
                        variant="outline"
                        className="w-full h-11"
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        {isApplyingPromo ? "Applying..." : "Apply Promo Code"}
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800">
                            {appliedPromo.code}
                          </span>
                        </div>
                        <Button 
                          onClick={removePromoCode}
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-800 h-auto p-1"
                        >
                          Remove
                        </Button>
                      </div>
                      <p className="text-sm text-green-700">
                        {appliedPromo.discount_type === 'percentage' 
                          ? `${appliedPromo.discount_value}% discount applied` 
                          : `৳${appliedPromo.discount_value} discount applied`}
                      </p>
                    </div>
                  )}
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-base text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-৳{calculateDiscount().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">৳{getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full h-12 text-base font-semibold" onClick={handleCheckout}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Proceed to Checkout
                </Button>

                <div className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <span>🔒</span>
                  <span>Secure checkout powered by BC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
