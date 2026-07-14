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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      energy_iq_assessments: {
        Row: {
          ai_recommendation_status: string
          answers: Json
          assessment_id: string
          built_form: string | null
          calculation_version: string
          completed_at: string
          created_at: string
          current_epc_rating: string | null
          current_epc_score: number | null
          email: string
          energy_iq_band: string
          energy_iq_score: number
          epc_identifier: string | null
          epc_recommendations: Json
          findings: Json
          first_name: string
          floor_area: number | null
          full_address: string | null
          ghl_contact_id: string | null
          ghl_opportunity_id: string | null
          ghl_sync_error: string | null
          ghl_sync_status: string
          id: string
          identified_opportunities: Json
          last_name: string
          main_heating: string | null
          marketing_consent: boolean
          pdf_status: string
          pdf_url: string | null
          personalised_roadmap: Json
          postcode: string | null
          potential_epc_rating: string | null
          potential_epc_score: number | null
          privacy_consent: boolean
          property_data_found: boolean
          property_type: string | null
          questionnaire_version: string
          result_summary: string | null
          skipped_questions: Json
          telephone: string
          updated_at: string
        }
        Insert: {
          ai_recommendation_status?: string
          answers?: Json
          assessment_id?: string
          built_form?: string | null
          calculation_version?: string
          completed_at?: string
          created_at?: string
          current_epc_rating?: string | null
          current_epc_score?: number | null
          email: string
          energy_iq_band: string
          energy_iq_score: number
          epc_identifier?: string | null
          epc_recommendations?: Json
          findings?: Json
          first_name: string
          floor_area?: number | null
          full_address?: string | null
          ghl_contact_id?: string | null
          ghl_opportunity_id?: string | null
          ghl_sync_error?: string | null
          ghl_sync_status?: string
          id?: string
          identified_opportunities?: Json
          last_name: string
          main_heating?: string | null
          marketing_consent?: boolean
          pdf_status?: string
          pdf_url?: string | null
          personalised_roadmap?: Json
          postcode?: string | null
          potential_epc_rating?: string | null
          potential_epc_score?: number | null
          privacy_consent?: boolean
          property_data_found?: boolean
          property_type?: string | null
          questionnaire_version?: string
          result_summary?: string | null
          skipped_questions?: Json
          telephone: string
          updated_at?: string
        }
        Update: {
          ai_recommendation_status?: string
          answers?: Json
          assessment_id?: string
          built_form?: string | null
          calculation_version?: string
          completed_at?: string
          created_at?: string
          current_epc_rating?: string | null
          current_epc_score?: number | null
          email?: string
          energy_iq_band?: string
          energy_iq_score?: number
          epc_identifier?: string | null
          epc_recommendations?: Json
          findings?: Json
          first_name?: string
          floor_area?: number | null
          full_address?: string | null
          ghl_contact_id?: string | null
          ghl_opportunity_id?: string | null
          ghl_sync_error?: string | null
          ghl_sync_status?: string
          id?: string
          identified_opportunities?: Json
          last_name?: string
          main_heating?: string | null
          marketing_consent?: boolean
          pdf_status?: string
          pdf_url?: string | null
          personalised_roadmap?: Json
          postcode?: string | null
          potential_epc_rating?: string | null
          potential_epc_score?: number | null
          privacy_consent?: boolean
          property_data_found?: boolean
          property_type?: string | null
          questionnaire_version?: string
          result_summary?: string | null
          skipped_questions?: Json
          telephone?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      submit_energy_iq_assessment: {
        Args: { assessment: Json }
        Returns: {
          assessment_id: string
        }[]
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
