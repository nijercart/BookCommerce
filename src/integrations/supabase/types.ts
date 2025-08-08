export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_roles: {
        Row: {
          created_at: string
          id: string
          permissions: Json
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permissions?: Json
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permissions?: Json
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      best_authors: {
        Row: {
          author_name: string
          created_at: string
          created_by: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          author_name: string
          created_at?: string
          created_by?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          author_name?: string
          created_at?: string
          created_by?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      book_requests: {
        Row: {
          author: string
          budget: number | null
          condition_preference: string
          created_at: string
          id: string
          is_guest: boolean | null
          mobile: string | null
          notes: string | null
          status: string
          telegram: string | null
          title: string
          updated_at: string
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          author: string
          budget?: number | null
          condition_preference: string
          created_at?: string
          id?: string
          is_guest?: boolean | null
          mobile?: string | null
          notes?: string | null
          status?: string
          telegram?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          author?: string
          budget?: number | null
          condition_preference?: string
          created_at?: string
          id?: string
          is_guest?: boolean | null
          mobile?: string | null
          notes?: string | null
          status?: string
          telegram?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      customer_communications: {
        Row: {
          communication_type: string
          created_at: string
          id: string
          inquiry_id: string | null
          is_internal: boolean
          message: string
          staff_id: string | null
          ticket_id: string | null
          user_id: string | null
        }
        Insert: {
          communication_type?: string
          created_at?: string
          id?: string
          inquiry_id?: string | null
          is_internal?: boolean
          message: string
          staff_id?: string | null
          ticket_id?: string | null
          user_id?: string | null
        }
        Update: {
          communication_type?: string
          created_at?: string
          id?: string
          inquiry_id?: string | null
          is_internal?: boolean
          message?: string
          staff_id?: string | null
          ticket_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_communications_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "customer_inquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_communications_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          inquiry_type: string
          message: string
          name: string
          phone: string | null
          responded_at: string | null
          responded_by: string | null
          response: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          inquiry_type?: string
          message: string
          name: string
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          response?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string
          message?: string
          name?: string
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          response?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      email_analytics: {
        Row: {
          campaign_id: string | null
          created_at: string
          date: string
          id: string
          total_bounced: number | null
          total_clicked: number | null
          total_delivered: number | null
          total_opened: number | null
          total_sent: number | null
          total_unsubscribed: number | null
          unique_clicks: number | null
          unique_opens: number | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          date: string
          id?: string
          total_bounced?: number | null
          total_clicked?: number | null
          total_delivered?: number | null
          total_opened?: number | null
          total_sent?: number | null
          total_unsubscribed?: number | null
          unique_clicks?: number | null
          unique_opens?: number | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          date?: string
          id?: string
          total_bounced?: number | null
          total_clicked?: number | null
          total_delivered?: number | null
          total_opened?: number | null
          total_sent?: number | null
          total_unsubscribed?: number | null
          unique_clicks?: number | null
          unique_opens?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "email_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          bounce_count: number | null
          campaign_type: string
          click_count: number | null
          created_at: string
          created_by: string | null
          html_content: string | null
          id: string
          name: string
          open_count: number | null
          recipient_count: number | null
          scheduled_at: string | null
          segment_criteria: Json | null
          sender_email: string
          sender_name: string
          sent_at: string | null
          sent_count: number | null
          status: string
          subject: string
          tags: Json | null
          template_id: string | null
          text_content: string | null
          unsubscribe_count: number | null
          updated_at: string
        }
        Insert: {
          bounce_count?: number | null
          campaign_type?: string
          click_count?: number | null
          created_at?: string
          created_by?: string | null
          html_content?: string | null
          id?: string
          name: string
          open_count?: number | null
          recipient_count?: number | null
          scheduled_at?: string | null
          segment_criteria?: Json | null
          sender_email?: string
          sender_name?: string
          sent_at?: string | null
          sent_count?: number | null
          status?: string
          subject: string
          tags?: Json | null
          template_id?: string | null
          text_content?: string | null
          unsubscribe_count?: number | null
          updated_at?: string
        }
        Update: {
          bounce_count?: number | null
          campaign_type?: string
          click_count?: number | null
          created_at?: string
          created_by?: string | null
          html_content?: string | null
          id?: string
          name?: string
          open_count?: number | null
          recipient_count?: number | null
          scheduled_at?: string | null
          segment_criteria?: Json | null
          sender_email?: string
          sender_name?: string
          sent_at?: string | null
          sent_count?: number | null
          status?: string
          subject?: string
          tags?: Json | null
          template_id?: string | null
          text_content?: string | null
          unsubscribe_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sends: {
        Row: {
          bounce_reason: string | null
          bounced_at: string | null
          campaign_id: string | null
          click_count: number | null
          click_data: Json | null
          clicked_at: string | null
          created_at: string
          delivered_at: string | null
          email: string
          id: string
          open_count: number | null
          opened_at: string | null
          resend_id: string | null
          sent_at: string | null
          status: string
          subscriber_id: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          bounce_reason?: string | null
          bounced_at?: string | null
          campaign_id?: string | null
          click_count?: number | null
          click_data?: Json | null
          clicked_at?: string | null
          created_at?: string
          delivered_at?: string | null
          email: string
          id?: string
          open_count?: number | null
          opened_at?: string | null
          resend_id?: string | null
          sent_at?: string | null
          status?: string
          subscriber_id?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          bounce_reason?: string | null
          bounced_at?: string | null
          campaign_id?: string | null
          click_count?: number | null
          click_data?: Json | null
          clicked_at?: string | null
          created_at?: string
          delivered_at?: string | null
          email?: string
          id?: string
          open_count?: number | null
          opened_at?: string | null
          resend_id?: string | null
          sent_at?: string | null
          status?: string
          subscriber_id?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_sends_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sends_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "email_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequence_enrollments: {
        Row: {
          completed_at: string | null
          created_at: string
          current_step: number | null
          enrolled_at: string | null
          id: string
          next_send_at: string | null
          sequence_id: string | null
          status: string
          subscriber_id: string | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_step?: number | null
          enrolled_at?: string | null
          id?: string
          next_send_at?: string | null
          sequence_id?: string | null
          status?: string
          subscriber_id?: string | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_step?: number | null
          enrolled_at?: string | null
          id?: string
          next_send_at?: string | null
          sequence_id?: string | null
          status?: string
          subscriber_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_sequence_enrollments_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "email_sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sequence_enrollments_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "email_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequence_steps: {
        Row: {
          conditions: Json | null
          created_at: string
          delay_amount: number
          delay_unit: string
          id: string
          sequence_id: string | null
          step_order: number
          template_id: string | null
        }
        Insert: {
          conditions?: Json | null
          created_at?: string
          delay_amount?: number
          delay_unit?: string
          id?: string
          sequence_id?: string | null
          step_order: number
          template_id?: string | null
        }
        Update: {
          conditions?: Json | null
          created_at?: string
          delay_amount?: number
          delay_unit?: string
          id?: string
          sequence_id?: string | null
          step_order?: number
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_sequence_steps_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "email_sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sequence_steps_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequences: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          status: string
          trigger_criteria: Json | null
          trigger_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string
          trigger_criteria?: Json | null
          trigger_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string
          trigger_criteria?: Json | null
          trigger_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_subscribers: {
        Row: {
          created_at: string
          custom_fields: Json | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          source: string | null
          status: string
          subscribed_at: string | null
          tags: Json | null
          unsubscribed_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          custom_fields?: Json | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          subscribed_at?: string | null
          tags?: Json | null
          unsubscribed_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          custom_fields?: Json | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          subscribed_at?: string | null
          tags?: Json | null
          unsubscribed_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          created_by: string | null
          html_content: string
          id: string
          name: string
          status: string
          subject: string
          template_type: string
          text_content: string | null
          updated_at: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          html_content: string
          id?: string
          name: string
          status?: string
          subject: string
          template_type?: string
          text_content?: string | null
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          html_content?: string
          id?: string
          name?: string
          status?: string
          subject?: string
          template_type?: string
          text_content?: string | null
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      hero_images: {
        Row: {
          alt_text: string | null
          created_at: string
          created_by: string | null
          device_type: string
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          created_by?: string | null
          device_type: string
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          created_by?: string | null
          device_type?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          book_author: string
          book_id: string
          book_image: string | null
          book_title: string
          created_at: string
          id: string
          order_id: string
          price: number
          quantity: number
        }
        Insert: {
          book_author: string
          book_id: string
          book_image?: string | null
          book_title: string
          created_at?: string
          id?: string
          order_id: string
          price: number
          quantity?: number
        }
        Update: {
          book_author?: string
          book_id?: string
          book_image?: string | null
          book_title?: string
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          id: string
          notes: string | null
          order_number: string
          payment_method: string | null
          shipping_address: Json | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          order_number: string
          payment_method?: string | null
          shipping_address?: Json | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          shipping_address?: Json | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_path: string
          image_url: string
          is_primary: boolean | null
          product_id: string | null
          sort_order: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_path: string
          image_url: string
          is_primary?: boolean | null
          product_id?: string | null
          sort_order?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_path?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_price_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          new_price: number
          old_price: number
          product_id: string | null
          reason: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_price: number
          old_price: number
          product_id?: string | null
          reason?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_price?: number
          old_price?: number
          product_id?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          author: string
          category: string
          condition: string
          created_at: string
          created_by: string | null
          description: string | null
          dimensions: string | null
          featured: boolean | null
          id: string
          images: Json | null
          isbn: string | null
          language: string | null
          original_price: number | null
          pages: number | null
          price: number
          publication_year: number | null
          publisher: string | null
          status: string
          stock_quantity: number
          tags: Json | null
          title: string
          updated_at: string
          updated_by: string | null
          weight: number | null
        }
        Insert: {
          author: string
          category?: string
          condition?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          dimensions?: string | null
          featured?: boolean | null
          id?: string
          images?: Json | null
          isbn?: string | null
          language?: string | null
          original_price?: number | null
          pages?: number | null
          price: number
          publication_year?: number | null
          publisher?: string | null
          status?: string
          stock_quantity?: number
          tags?: Json | null
          title: string
          updated_at?: string
          updated_by?: string | null
          weight?: number | null
        }
        Update: {
          author?: string
          category?: string
          condition?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          dimensions?: string | null
          featured?: boolean | null
          id?: string
          images?: Json | null
          isbn?: string | null
          language?: string | null
          original_price?: number | null
          pages?: number | null
          price?: number
          publication_year?: number | null
          publisher?: string | null
          status?: string
          stock_quantity?: number
          tags?: Json | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          discount_type: string
          discount_value: number
          id: string
          status: string
          updated_at: string
          usage_limit: number | null
          used_count: number
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          discount_type: string
          discount_value: number
          id?: string
          status?: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          status?: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          customer_email: string | null
          customer_phone: string | null
          description: string
          id: string
          priority: string
          resolution: string | null
          resolved_at: string | null
          status: string
          subject: string
          ticket_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          customer_email?: string | null
          customer_phone?: string | null
          description: string
          id?: string
          priority?: string
          resolution?: string | null
          resolved_at?: string | null
          status?: string
          subject: string
          ticket_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          customer_email?: string | null
          customer_phone?: string | null
          description?: string
          id?: string
          priority?: string
          resolution?: string | null
          resolved_at?: string | null
          status?: string
          subject?: string
          ticket_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          book_author: string
          book_condition: string
          book_id: string
          book_image: string | null
          book_price: number
          book_title: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          book_author: string
          book_condition: string
          book_id: string
          book_image?: string | null
          book_price: number
          book_title: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          book_author?: string
          book_condition?: string
          book_id?: string
          book_image?: string | null
          book_price?: number
          book_title?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_ticket_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
