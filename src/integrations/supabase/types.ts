export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          candidate_name: string
          cover_letter: string | null
          details: Json | null
          email: string
          id: string
          job_id: string | null
          phone: string | null
          resume_url: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          candidate_name: string
          cover_letter?: string | null
          details?: Json | null
          email: string
          id?: string
          job_id?: string | null
          phone?: string | null
          resume_url?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          candidate_name?: string
          cover_letter?: string | null
          details?: Json | null
          email?: string
          id?: string
          job_id?: string | null
          phone?: string | null
          resume_url?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          client_name: string | null
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          industry: string | null
          link: string | null
          status: string | null
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          client_name?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          industry?: string | null
          link?: string | null
          status?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          client_name?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          industry?: string | null
          link?: string | null
          status?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          company: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          subject: string | null
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          subject?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          subject?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          requirements: string | null
          salary_range: string | null
          specialization: string | null
          status: string | null
          title: string
          type: string | null
          updated_at: string | null
          content_nl: Json | null
          translation_status: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          requirements?: string | null
          salary_range?: string | null
          specialization?: string | null
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          content_nl?: Json | null
          translation_status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          requirements?: string | null
          salary_range?: string | null
          specialization?: string | null
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          content_nl?: Json | null
          translation_status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_pages: {
        Row: {
          id: string
          slug: string
          title: string
          status: string | null
          content_nl: Json | null
          translation_status: string | null
          hero_headline: string | null
          hero_subheadline: string | null
          hero_cta_text: string | null
          hero_image_url: string | null
          introduction_title: string | null
          introduction_content: string | null
          differentiator_title: string | null
          differentiator_content: string | null
          differentiator_video_url: string | null
          core_offerings: Json | null
          benefits: Json | null
          process_steps: Json | null
          case_studies: Json | null
          tech_stack: Json | null
          why_choose_us: Json | null
          consultation_title: string | null
          consultation_description: string | null
          social_proof_logos: Json | null
          testimonials: Json | null
          final_cta_title: string | null
          final_cta_description: string | null
          final_cta_button_text: string | null
          meta_description: string | null
          mini_cta_text: string | null
          mini_cta_subtext: string | null
          mini_cta_link: string | null
          display_order: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          status?: string | null
          content_nl?: Json | null
          translation_status?: string | null
          hero_headline?: string | null
          hero_subheadline?: string | null
          hero_cta_text?: string | null
          hero_image_url?: string | null
          introduction_title?: string | null
          introduction_content?: string | null
          differentiator_title?: string | null
          differentiator_content?: string | null
          differentiator_video_url?: string | null
          core_offerings?: Json | null
          benefits?: Json | null
          process_steps?: Json | null
          case_studies?: Json | null
          tech_stack?: Json | null
          why_choose_us?: Json | null
          consultation_title?: string | null
          consultation_description?: string | null
          social_proof_logos?: Json | null
          testimonials?: Json | null
          final_cta_title?: string | null
          final_cta_description?: string | null
          final_cta_button_text?: string | null
          meta_description?: string | null
          mini_cta_text?: string | null
          mini_cta_subtext?: string | null
          mini_cta_link?: string | null
          display_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          status?: string | null
          content_nl?: Json | null
          translation_status?: string | null
          hero_headline?: string | null
          hero_subheadline?: string | null
          hero_cta_text?: string | null
          hero_image_url?: string | null
          introduction_title?: string | null
          introduction_content?: string | null
          differentiator_title?: string | null
          differentiator_content?: string | null
          differentiator_video_url?: string | null
          core_offerings?: Json | null
          benefits?: Json | null
          process_steps?: Json | null
          case_studies?: Json | null
          tech_stack?: Json | null
          why_choose_us?: Json | null
          consultation_title?: string | null
          consultation_description?: string | null
          social_proof_logos?: Json | null
          testimonials?: Json | null
          final_cta_title?: string | null
          final_cta_description?: string | null
          final_cta_button_text?: string | null
          meta_description?: string | null
          mini_cta_text?: string | null
          mini_cta_subtext?: string | null
          mini_cta_link?: string | null
          display_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          id: string
          translation_key: string
          language: string
          translation_value: string
          category: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          translation_key: string
          language: string
          translation_value: string
          category?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          translation_key?: string
          language?: string
          translation_value?: string
          category?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
