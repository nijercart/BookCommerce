
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, CreditCard, Truck, CheckCircle, ShoppingBag } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCartStore } from "@/lib/cartStore";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
}

interface CartItem {
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    image: string;
    condition: "new" | "old";
  };
  quantity: number;
}

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isBuyNowMode = searchParams.get('mode') === 'buynow';
  const { items: cartItems, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuth();
  const { toast } = useToast();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: '',
    phone: '',
    address: '',
    city: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);

  // Get items to process (either cart items or buy now item)
  const getItemsToProcess = () => {
    if (isBuyNowMode && buyNowItem) {
      return [buyNowItem];
    }
    return cartItems;
  };

  const items = getItemsToProcess();

  useEffect(() => {
    if (isBuyNowMode) {
      // Get buy now item from session storage
      const storedItem = sessionStorage.getItem('buyNowItem');
      if (storedItem) {
        setBuyNowItem(JSON.parse(storedItem));
      } else {
        // If no buy now item found, redirect to books page
        navigate('/books');
        return;
      }
    } else if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, cartItems.length, navigate, isBuyNowMode]);

  const promoCodes = [
    { code: 'SAVE10', discount: 10 },
    { code: 'FREESHIP', discount: 5 },
  ];

  const calculateDeliveryCharge = () => {
    return 60;
  };

  const applyDiscount = () => {
    const promo = promoCodes.find((p) => p.code === discountCode);
    if (promo) {
      setDiscountAmount(promo.discount);
      setIsDiscountApplied(true);
      toast({
        title: "Discount Applied! ",
        description: `You have received ${promo.discount}% discount.`,
      });
    } else {
      setDiscountAmount(0);
      setIsDiscountApplied(false);
      toast({
        title: "Invalid code",
        description: "The discount code you entered is not valid.",
        variant: "destructive"
      });
    }
  };

  const calculateSubtotal = () => {
    if (isBuyNowMode && buyNowItem) {
      return buyNowItem.book.price * buyNowItem.quantity;
    }
    return getTotalPrice();
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    const discount = isDiscountApplied ? (subtotal * discountAmount) / 100 : 0;
    return discount;
  };

  const calculateFinalTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryCharge = calculateDeliveryCharge();
    const discount = calculateDiscount();
    const total = subtotal + deliveryCharge - discount;
    return total;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to place an order.",
        variant: "destructive"
      });
      return;
    }

    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city) {
      toast({
        title: "Missing information",
        description: "Please fill in all required shipping information.",
        variant: "destructive"
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method.",
        variant: "destructive"
      });
      return;
    }

    if (!transactionId.trim()) {
      toast({
        title: "Transaction ID required",
        description: "Please enter the transaction ID from your payment.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Calculate totals using the same functions (without tax)
      const subtotal = calculateSubtotal();
      const deliveryCharge = calculateDeliveryCharge();
      const discount = calculateDiscount();
      const totalAmount = calculateFinalTotal();

      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          total_amount: totalAmount,
          status: 'pending',
          payment_method: paymentMethod,
          shipping_address: shippingAddress as any, // Cast to any to satisfy Json type
          notes: `Transaction ID: ${transactionId}${orderNotes ? ` | Notes: ${orderNotes}` : ''}`
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        book_id: item.book.id,
        book_title: item.book.title,
        book_author: item.book.author,
        book_image: item.book.image,
        quantity: item.quantity,
        price: item.book.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart if it was a cart purchase, or clear session storage if buy now
      if (isBuyNowMode) {
        sessionStorage.removeItem('buyNowItem');
      } else {
        clearCart();
      }

      toast({
        title: "Order placed successfully! ",
        description: `Your order ${orderNumber} has been received and is being processed.`,
      });

      // Navigate to success page or orders page
      navigate('/orders');

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error placing order",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center py-32">
          <ShoppingBag className="h-10 w-10 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
            {isBuyNowMode ? "No item to purchase" : "Your cart is empty"}
          </h2>
          <p className="text-muted-foreground mb-4">
            {isBuyNowMode ? "Please select an item to buy." : "Add items to your cart to proceed to checkout."}
          </p>
          <Button asChild variant="link">
            <Link to="/books">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            asChild 
            className="rounded-full hover:bg-muted"
          >
            <Link to={isBuyNowMode ? "/books" : "/cart"}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              {isBuyNowMode ? "Quick Checkout" : "Checkout"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isBuyNowMode ? "Complete your purchase" : "Review your order and complete your purchase"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shipping Information - Left Column */}
          <div className="lg:col-span-7">
            <Card className="space-y-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      type="text" 
                      id="name" 
                      placeholder="John Doe" 
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      type="tel" 
                      id="phone" 
                      placeholder="+8801XXXXXXXXX" 
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    type="text" 
                    id="address" 
                    placeholder="House No, Street Name" 
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input 
                    type="text" 
                    id="city" 
                    placeholder="Dhaka" 
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="space-y-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <RadioGroup onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bkash" id="bkash" className="peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                    <Label htmlFor="bkash">bKash</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nagad" id="nagad" className="peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                    <Label htmlFor="nagad">Nagad</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rocket" id="rocket" className="peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                    <Label htmlFor="rocket">Rocket</Label>
                  </div>
                </RadioGroup>
                
                <Separator className="my-4" />
                
                <div className="grid gap-2">
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input 
                    type="text" 
                    id="transactionId" 
                    placeholder="Enter transaction ID" 
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card className="space-y-4">
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Order Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Any additional notes for your order..." 
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-5">
            <div className="sticky top-4 space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    {isBuyNowMode ? "Item to Purchase" : "Order Summary"}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {items.map((item, index) => (
                    <div key={`${item.book.id}-${index}`} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-16 h-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        <img 
                          src={item.book.image} 
                          alt={item.book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold text-sm leading-tight line-clamp-2">
                          {item.book.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          by {item.book.author}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={item.book.condition === "new" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {item.book.condition === "new" ? "New" : "Pre-owned"}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Qty: {item.quantity}
                            </span>
                          </div>
                          <span className="font-semibold">
                            ৳{(item.book.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Pricing Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Breakdown</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-semibold">৳{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Charge:</span>
                    <span className="font-semibold">৳{calculateDeliveryCharge().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="font-semibold">- ৳{calculateDiscount().toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>৳{calculateFinalTotal().toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Discount Code */}
              <Card className="space-y-4">
                <CardHeader>
                  <CardTitle>Apply Discount Code</CardTitle>
                </CardHeader>
                
                <CardContent className="grid gap-4">
                  <div className="flex items-center">
                    <Input 
                      type="text" 
                      placeholder="Discount Code" 
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <Button size="sm" className="ml-2" onClick={applyDiscount}>Apply</Button>
                  </div>
                  {isDiscountApplied && (
                    <Badge variant="outline">Discount Applied</Badge>
                  )}
                </CardContent>
              </Card>

              {/* Place Order Button */}
              <Button 
                size="lg" 
                className="w-full" 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Truck className="w-5 h-5 mr-2" />
                    Place Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
