import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  BarChart3, 
  Mail, 
  FileText,
  Database,
  Settings,
  TrendingUp,
  Calendar
} from "lucide-react";

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your bookstore operations and view analytics</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            className="h-24 flex-col gap-2"
          >
            <Settings className="h-6 w-6" />
            <span className="text-sm">Main Dashboard</span>
          </Button>

          <Button
            onClick={() => navigate("/admin/schema")}
            variant="outline"
            className="h-24 flex-col gap-2"
          >
            <Database className="h-6 w-6" />
            <span className="text-sm">Database Schema</span>
          </Button>

          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => navigate("/admin#products")}
                  variant="ghost"
                  className="h-20 flex-col gap-2 border border-border"
                >
                  <Package className="h-5 w-5" />
                  <span className="text-sm">Manage Products</span>
                </Button>
                
                <Button
                  onClick={() => navigate("/admin#orders")}
                  variant="ghost"
                  className="h-20 flex-col gap-2 border border-border"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-sm">View Orders</span>
                </Button>
                
                <Button
                  onClick={() => navigate("/admin#analytics")}
                  variant="ghost"
                  className="h-20 flex-col gap-2 border border-border"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm">Analytics</span>
                </Button>
                
                <Button
                  onClick={() => navigate("/admin#requests")}
                  variant="ghost"
                  className="h-20 flex-col gap-2 border border-border"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-sm">Book Requests</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminHome;