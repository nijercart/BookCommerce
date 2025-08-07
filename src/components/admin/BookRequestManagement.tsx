import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Clock, Search, CheckCircle, AlertCircle, Phone, MessageCircle, ExternalLink } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type BookRequest = Tables<"book_requests">;

export function BookRequestManagement() {
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookRequests();
    
    // Set up real-time subscription for book requests
    const channel = supabase
      .channel('admin_book_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'book_requests'
        },
        () => {
          fetchBookRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBookRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("book_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching book requests:", error);
      toast({
        title: "Error",
        description: "Failed to fetch book requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    setUpdatingStatus(requestId);
    
    try {
      const { error } = await supabase
        .from("book_requests")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Request status updated successfully"
      });
      
      fetchBookRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "searching":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "found":
        return "bg-green-100 text-green-800 border-green-200";
      case "unavailable":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "searching":
        return <Search className="h-4 w-4" />;
      case "found":
        return <CheckCircle className="h-4 w-4" />;
      case "unavailable":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatContactInfo = (request: BookRequest) => {
    const contacts = [];
    if (request.mobile) contacts.push({ type: 'Mobile', value: request.mobile, icon: Phone });
    if (request.whatsapp) contacts.push({ type: 'WhatsApp', value: request.whatsapp, icon: MessageCircle });
    if (request.telegram) contacts.push({ type: 'Telegram', value: request.telegram, icon: ExternalLink });
    return contacts;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Book Requests</CardTitle>
          <CardDescription>Loading book requests...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Book Requests Management
            </CardTitle>
            <CardDescription>
              Manage and track all customer book requests
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {requests.length} Total Requests
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="border border-border/50">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Book Information */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{request.title}</h3>
                        <p className="text-muted-foreground">by {request.author}</p>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Condition:</span>
                          <span>{request.condition_preference}</span>
                        </div>
                        {request.budget && (
                          <div className="flex justify-between">
                            <span className="font-medium">Budget:</span>
                            <span>৳{request.budget}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="font-medium">Submitted:</span>
                          <span>{new Date(request.created_at).toLocaleDateString()}</span>
                        </div>
                        {request.is_guest && (
                          <Badge variant="secondary" className="text-xs">
                            Guest Request
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Contact Information</h4>
                      <div className="space-y-2">
                        {formatContactInfo(request).map((contact, index) => {
                          const IconComponent = contact.icon;
                          return (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <IconComponent className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{contact.type}:</span>
                              <span>{contact.value}</span>
                            </div>
                          );
                        })}
                        
                        {request.notes && (
                          <div className="mt-3">
                            <p className="font-medium text-sm mb-1">Notes:</p>
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {request.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Management */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge className={`flex items-center gap-2 ${getStatusColor(request.status)}`} variant="outline">
                          {getStatusIcon(request.status)}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Update Status:</label>
                        <Select
                          value={request.status}
                          onValueChange={(value) => updateRequestStatus(request.id, value)}
                          disabled={updatingStatus === request.id}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="searching">Searching</SelectItem>
                            <SelectItem value="found">Found</SelectItem>
                            <SelectItem value="unavailable">Unavailable</SelectItem>
                          </SelectContent>
                        </Select>
                        {updatingStatus === request.id && (
                          <p className="text-xs text-muted-foreground">Updating...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Book Requests Yet</h3>
            <p className="text-muted-foreground">
              Book requests from customers will appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}