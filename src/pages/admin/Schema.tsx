import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Database } from "lucide-react";
import { toast } from "sonner";

const Schema = () => {
  const [activeTab, setActiveTab] = useState("all");

  const handleExportPNG = () => {
    toast.info("PNG export functionality would be implemented with html2canvas");
  };

  const handleExportPDF = () => {
    toast.info("PDF export functionality would be implemented with jsPDF");
  };

  const allTablesERD = `
erDiagram
    %% Core Authentication & User Management
    auth_users ||--o{ profiles : "user_id"
    profiles ||--o{ admin_roles : "user_id"
    
    %% Commerce Core
    auth_users ||--o{ orders : "user_id"
    orders ||--o{ order_items : "order_id"
    auth_users ||--o{ wishlists : "user_id"
    auth_users ||--o{ book_requests : "user_id"
    
    %% Product Management
    products ||--o{ product_images : "product_id"
    products ||--o{ product_price_history : "product_id"
    
    %% Email Marketing System
    email_templates ||--o{ email_campaigns : "template_id"
    email_campaigns ||--o{ email_sends : "campaign_id"
    email_subscribers ||--o{ email_sends : "subscriber_id"
    email_sequences ||--o{ email_sequence_steps : "sequence_id"
    email_sequences ||--o{ email_sequence_enrollments : "sequence_id"
    email_subscribers ||--o{ email_sequence_enrollments : "subscriber_id"
    email_campaigns ||--o{ email_analytics : "campaign_id"
    
    %% Customer Support
    auth_users ||--o{ support_tickets : "user_id"
    auth_users ||--o{ customer_inquiries : "user_id"
    support_tickets ||--o{ customer_communications : "ticket_id"
    customer_inquiries ||--o{ customer_communications : "inquiry_id"
    
    %% Configuration & Content
    auth_users ||--o{ hero_images : "created_by"
    auth_users ||--o{ best_authors : "created_by"
    auth_users ||--o{ promo_codes : "created_by"
  `;

  const commerceERD = `
erDiagram
    auth_users {
        uuid id PK
        string email
        timestamp created_at
    }
    
    profiles {
        uuid id PK
        uuid user_id FK
        string display_name
        string avatar_url
        string phone
        text bio
        timestamp created_at
        timestamp updated_at
    }
    
    orders {
        uuid id PK
        uuid user_id FK
        string order_number
        numeric total_amount
        string currency
        string status
        string payment_method
        jsonb shipping_address
        text notes
        timestamp created_at
        timestamp updated_at
    }
    
    order_items {
        uuid id PK
        uuid order_id FK
        string book_id
        string book_title
        string book_author
        string book_image
        numeric price
        integer quantity
        timestamp created_at
    }
    
    wishlists {
        uuid id PK
        uuid user_id FK
        string book_id
        string book_title
        string book_author
        string book_image
        string book_condition
        numeric book_price
        timestamp created_at
    }
    
    book_requests {
        uuid id PK
        uuid user_id FK
        string title
        string author
        string condition_preference
        numeric budget
        text notes
        string whatsapp
        string telegram
        string mobile
        string status
        boolean is_guest
        timestamp created_at
        timestamp updated_at
    }
    
    products {
        uuid id PK
        string title
        string author
        string isbn
        text description
        string category
        string condition
        string publisher
        string language
        numeric price
        numeric original_price
        integer stock_quantity
        integer publication_year
        integer pages
        numeric weight
        string dimensions
        jsonb images
        jsonb tags
        boolean featured
        string status
        uuid created_by FK
        uuid updated_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    product_images {
        uuid id PK
        uuid product_id FK
        string image_url
        string image_path
        string alt_text
        integer sort_order
        boolean is_primary
        timestamp created_at
    }
    
    product_price_history {
        uuid id PK
        uuid product_id FK
        numeric old_price
        numeric new_price
        uuid changed_by FK
        string reason
        timestamp created_at
    }
    
    promo_codes {
        uuid id PK
        string code
        string discount_type
        numeric discount_value
        integer usage_limit
        integer used_count
        timestamp valid_from
        timestamp valid_until
        string status
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    auth_users ||--o{ profiles : "user_id"
    auth_users ||--o{ orders : "user_id"
    auth_users ||--o{ wishlists : "user_id"
    auth_users ||--o{ book_requests : "user_id"
    orders ||--o{ order_items : "order_id"
    products ||--o{ product_images : "product_id"
    products ||--o{ product_price_history : "product_id"
  `;

  const emailERD = `
erDiagram
    email_templates {
        uuid id PK
        string name
        string subject
        text html_content
        text text_content
        string template_type
        string status
        jsonb variables
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    email_campaigns {
        uuid id PK
        string name
        string subject
        text html_content
        text text_content
        string campaign_type
        string status
        string sender_email
        string sender_name
        uuid template_id FK
        jsonb segment_criteria
        jsonb tags
        integer recipient_count
        integer sent_count
        integer open_count
        integer click_count
        integer bounce_count
        integer unsubscribe_count
        timestamp scheduled_at
        timestamp sent_at
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    email_subscribers {
        uuid id PK
        string email
        string first_name
        string last_name
        string phone
        string status
        string source
        jsonb tags
        jsonb custom_fields
        uuid user_id FK
        timestamp subscribed_at
        timestamp unsubscribed_at
        timestamp created_at
        timestamp updated_at
    }
    
    email_sends {
        uuid id PK
        uuid campaign_id FK
        uuid subscriber_id FK
        string email
        string status
        string resend_id
        timestamp sent_at
        timestamp delivered_at
        timestamp opened_at
        timestamp clicked_at
        timestamp bounced_at
        timestamp unsubscribed_at
        string bounce_reason
        integer open_count
        integer click_count
        jsonb click_data
        timestamp created_at
    }
    
    email_sequences {
        uuid id PK
        string name
        text description
        string trigger_type
        string status
        jsonb trigger_criteria
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    email_sequence_steps {
        uuid id PK
        uuid sequence_id FK
        integer step_order
        uuid template_id FK
        integer delay_amount
        string delay_unit
        jsonb conditions
        timestamp created_at
    }
    
    email_sequence_enrollments {
        uuid id PK
        uuid sequence_id FK
        uuid subscriber_id FK
        string status
        integer current_step
        timestamp enrolled_at
        timestamp completed_at
        timestamp next_send_at
        timestamp created_at
        timestamp updated_at
    }
    
    email_analytics {
        uuid id PK
        uuid campaign_id FK
        date date
        integer total_sent
        integer total_delivered
        integer total_opened
        integer total_clicked
        integer total_bounced
        integer total_unsubscribed
        integer unique_opens
        integer unique_clicks
        timestamp created_at
    }
    
    email_templates ||--o{ email_campaigns : "template_id"
    email_campaigns ||--o{ email_sends : "campaign_id"
    email_subscribers ||--o{ email_sends : "subscriber_id"
    email_sequences ||--o{ email_sequence_steps : "sequence_id"
    email_sequences ||--o{ email_sequence_enrollments : "sequence_id"
    email_subscribers ||--o{ email_sequence_enrollments : "subscriber_id"
    email_campaigns ||--o{ email_analytics : "campaign_id"
    email_sequence_steps ||--o{ email_templates : "template_id"
  `;

  const supportERD = `
erDiagram
    support_tickets {
        uuid id PK
        uuid user_id FK
        string ticket_number
        string subject
        text description
        string category
        string priority
        string status
        text resolution
        string customer_email
        string customer_phone
        uuid assigned_to FK
        timestamp created_at
        timestamp updated_at
        timestamp resolved_at
    }
    
    customer_inquiries {
        uuid id PK
        uuid user_id FK
        string name
        string email
        string phone
        string subject
        text message
        string inquiry_type
        string status
        text response
        uuid responded_by FK
        timestamp created_at
        timestamp updated_at
        timestamp responded_at
    }
    
    customer_communications {
        uuid id PK
        uuid ticket_id FK
        uuid inquiry_id FK
        uuid user_id FK
        uuid staff_id FK
        text message
        string communication_type
        boolean is_internal
        timestamp created_at
    }
    
    admin_roles {
        uuid id PK
        uuid user_id FK
        string role
        jsonb permissions
        timestamp created_at
        timestamp updated_at
    }
    
    best_authors {
        uuid id PK
        string author_name
        integer display_order
        boolean is_active
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    hero_images {
        uuid id PK
        string device_type
        string image_url
        string alt_text
        boolean is_active
        integer display_order
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    auth_users ||--o{ support_tickets : "user_id"
    auth_users ||--o{ customer_inquiries : "user_id"
    auth_users ||--o{ admin_roles : "user_id"
    support_tickets ||--o{ customer_communications : "ticket_id"
    customer_inquiries ||--o{ customer_communications : "inquiry_id"
  `;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Database Schema</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Visual representation of the database structure and relationships
          </p>
          
          <div className="flex gap-2 mb-6">
            <Button onClick={handleExportPNG} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PNG
            </Button>
            <Button onClick={handleExportPDF} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entity Relationship Diagrams</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Tables</TabsTrigger>
                <TabsTrigger value="commerce">Core Commerce</TabsTrigger>
                <TabsTrigger value="email">Email Marketing</TabsTrigger>
                <TabsTrigger value="support">Support System</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Complete Database Schema</h3>
                  <p className="text-sm text-muted-foreground">
                    High-level view showing all table relationships
                  </p>
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <pre className="text-xs overflow-x-auto">
                      <code>{allTablesERD}</code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="commerce" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Commerce & Product Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Orders, products, wishlists, and user management tables
                  </p>
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <pre className="text-xs overflow-x-auto">
                      <code>{commerceERD}</code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="email" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Email Marketing System</h3>
                  <p className="text-sm text-muted-foreground">
                    Campaigns, templates, subscribers, sequences, and analytics
                  </p>
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <pre className="text-xs overflow-x-auto">
                      <code>{emailERD}</code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="support" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Customer Support & Admin</h3>
                  <p className="text-sm text-muted-foreground">
                    Support tickets, inquiries, communications, and admin roles
                  </p>
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <pre className="text-xs overflow-x-auto">
                      <code>{supportERD}</code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Schema Notes</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All tables have Row Level Security (RLS) enabled</li>
                <li>• Foreign keys reference auth.users via user_id columns</li>
                <li>• JSONB columns store flexible data (tags, metadata, etc.)</li>
                <li>• Timestamps use 'timestamp with time zone' for UTC consistency</li>
                <li>• Admin functions protected via is_admin() security function</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Schema;