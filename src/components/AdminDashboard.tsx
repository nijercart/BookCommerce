import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Package, CheckCircle, XCircle, ShoppingCart, BookOpen, Tag, Image, Home, BarChart3, Users } from "lucide-react";
import { ProductManagement } from "./ProductManagement";
import { AdvancedAnalytics } from "./analytics/AdvancedAnalytics";
import { OrderManagement } from "./admin/OrderManagement";
import { BookRequestManagement } from "./admin/BookRequestManagement";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  recentOrders: any[];
}

// Sidebar navigation items
const sidebarItems = [
  { title: "Overview", value: "overview", icon: Home },
  { title: "Products", value: "products", icon: Package },
  { title: "Orders", value: "orders", icon: ShoppingCart },
  { title: "Book Requests", value: "requests", icon: BookOpen },
  { title: "Analytics", value: "analytics", icon: BarChart3 },
];

export function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardStats();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        return;
      }

      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const fetchDashboardStats = async () => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      
      // Fetch products stats
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, status, stock_quantity');

      if (productsError) throw productsError;

      const totalProducts = products?.length || 0;
      const activeProducts = products?.filter(p => p.status === 'active').length || 0;
      const outOfStock = products?.filter(p => p.stock_quantity === 0).length || 0;

      // Fetch recent orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (ordersError) throw ordersError;

      setStats({
        totalProducts,
        activeProducts,
        outOfStock,
        recentOrders: orders || []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Admin Sidebar Component
  function AdminSidebar() {
    const isActive = (value: string) => currentTab === value;

    return (
      <Sidebar className="border-r border-border/40">
        <SidebarContent className="bg-card">
          <div className="p-6 border-b border-border/40">
            <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">Manage your store</p>
          </div>
          
          <SidebarGroup className="px-4 py-6">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      onClick={() => setCurrentTab(item.value)}
                      className={`w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive(item.value)
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Products</p>
                      <p className="text-3xl font-bold text-blue-900">{stats?.totalProducts || 0}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Active Products</p>
                      <p className="text-3xl font-bold text-green-900">{stats?.activeProducts || 0}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Out of Stock</p>
                      <p className="text-3xl font-bold text-red-900">{stats?.outOfStock || 0}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Recent Orders</p>
                      <p className="text-3xl font-bold text-purple-900">{stats?.recentOrders.length || 0}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Button onClick={() => setCurrentTab("products")} className="h-20 flex-col gap-2">
                    <Package className="h-6 w-6" />
                    <span>Manage Products</span>
                  </Button>
                  <Button onClick={() => setCurrentTab("orders")} variant="outline" className="h-20 flex-col gap-2">
                    <ShoppingCart className="h-6 w-6" />
                    <span>View Orders</span>
                  </Button>
                  <Button onClick={() => setCurrentTab("requests")} variant="outline" className="h-20 flex-col gap-2">
                    <BookOpen className="h-6 w-6" />
                    <span>Book Requests</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "products":
        return <ProductManagement />;
      case "orders":
        return <OrderManagement />;
      case "requests":
        return <BookRequestManagement />;
      case "analytics":
        return <AdvancedAnalytics />;
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AdminSidebar />
        
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="border-b border-border/40 bg-card">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {sidebarItems.find(item => item.value === currentTab)?.title}
                  </h1>
                  <p className="text-muted-foreground">
                    {currentTab === "overview" && "Welcome to your admin dashboard"}
                    {currentTab === "products" && "Manage your product inventory"}
                    {currentTab === "orders" && "Track and manage customer orders"}
                    {currentTab === "requests" && "Handle customer book requests"}
                    {currentTab === "analytics" && "View detailed business analytics"}
                  </p>
                </div>
              </div>
              
              {stats && (
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="px-3 py-1">
                    <Package className="h-4 w-4 mr-2" />
                    {stats.totalProducts} Products
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {stats.recentOrders.length} Recent Orders
                  </Badge>
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default AdminDashboard;