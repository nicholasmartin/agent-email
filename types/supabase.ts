export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: {
          active: boolean | null
          company_id: string | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          key_hash: string
          key_prefix: string
          key_salt: string
          last_used_at: string | null
          name: string
          rate_limit: number | null
          scopes: string[] | null
          usage_count: number | null
        }
        Insert: {
          active?: boolean | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          key_hash: string
          key_prefix: string
          key_salt: string
          last_used_at?: string | null
          name: string
          rate_limit?: number | null
          scopes?: string[] | null
          usage_count?: number | null
        }
        Update: {
          active?: boolean | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          key_hash?: string
          key_prefix?: string
          key_salt?: string
          last_used_at?: string | null
          name?: string
          rate_limit?: number | null
          scopes?: string[] | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          active: boolean | null
          created_at: string | null
          default_api_key_id: string | null
          description: string | null
          id: string
          name: string
          slug: string
          smtp_enabled: boolean | null
          smtp_from_email: string | null
          smtp_from_name: string | null
          smtp_host: string | null
          smtp_password: string | null
          smtp_port: number | null
          smtp_reply_to_email: string | null
          smtp_secure: boolean | null
          smtp_signature: string | null
          smtp_user: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          default_api_key_id?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          smtp_enabled?: boolean | null
          smtp_from_email?: string | null
          smtp_from_name?: string | null
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: number | null
          smtp_reply_to_email?: string | null
          smtp_secure?: boolean | null
          smtp_signature?: string | null
          smtp_user?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          default_api_key_id?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          smtp_enabled?: boolean | null
          smtp_from_email?: string | null
          smtp_from_name?: string | null
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: number | null
          smtp_reply_to_email?: string | null
          smtp_secure?: boolean | null
          smtp_signature?: string | null
          smtp_user?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_default_api_key_id_fkey"
            columns: ["default_api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      debug_logs: {
        Row: {
          created_at: string | null
          extra_data: Json | null
          hash_params: Json | null
          id: string
          ip_address: string | null
          message: string | null
          server_timestamp: string | null
          timestamp: string | null
          type: string | null
          url: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          extra_data?: Json | null
          hash_params?: Json | null
          id?: string
          ip_address?: string | null
          message?: string | null
          server_timestamp?: string | null
          timestamp?: string | null
          type?: string | null
          url?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          extra_data?: Json | null
          hash_params?: Json | null
          id?: string
          ip_address?: string | null
          message?: string | null
          server_timestamp?: string | null
          timestamp?: string | null
          type?: string | null
          url?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          api_key: string | null
          api_key_id: string | null
          company_id: string | null
          completed_at: string | null
          created_at: string | null
          domain: string
          email: string
          email_body: string | null
          email_draft: Json | null
          email_sent: boolean | null
          email_subject: string | null
          error_message: string | null
          first_name: string | null
          from_website: boolean | null
          full_name: string | null
          id: string
          last_name: string | null
          metadata: Json | null
          processing_lock: string | null
          retry_count: number | null
          scrape_job_id: string | null
          scrape_result: Json | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          api_key?: string | null
          api_key_id?: string | null
          company_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          domain: string
          email: string
          email_body?: string | null
          email_draft?: Json | null
          email_sent?: boolean | null
          email_subject?: string | null
          error_message?: string | null
          first_name?: string | null
          from_website?: boolean | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          metadata?: Json | null
          processing_lock?: string | null
          retry_count?: number | null
          scrape_job_id?: string | null
          scrape_result?: Json | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          api_key?: string | null
          api_key_id?: string | null
          company_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          domain?: string
          email?: string
          email_body?: string | null
          email_draft?: Json | null
          email_sent?: boolean | null
          email_subject?: string | null
          error_message?: string | null
          first_name?: string | null
          from_website?: boolean | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          metadata?: Json | null
          processing_lock?: string | null
          retry_count?: number | null
          scrape_job_id?: string | null
          scrape_result?: Json | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      prompt_templates: {
        Row: {
          active: boolean | null
          company_id: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          max_length: number | null
          name: string
          style: string | null
          template: string
          tone: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          max_length?: number | null
          name: string
          style?: string | null
          template: string
          tone?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          max_length?: number | null
          name?: string
          style?: string | null
          template?: string
          tone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      trials: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          has_registered: boolean | null
          id: string
          job_id: string | null
          last_email_sent_at: string | null
          last_name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          has_registered?: boolean | null
          id?: string
          job_id?: string | null
          last_email_sent_at?: string | null
          last_name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          has_registered?: boolean | null
          id?: string
          job_id?: string | null
          last_email_sent_at?: string | null
          last_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "trials_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_debug_logs_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      increment: {
        Args: { row_id: string }
        Returns: number
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
