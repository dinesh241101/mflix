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
      ads: {
        Row: {
          ad_id: string
          ad_name: string
          ad_type: string
          content_url: string | null
          created_at: string | null
          display_frequency: number | null
          is_active: boolean | null
          position: string | null
          target_url: string | null
          updated_at: string | null
        }
        Insert: {
          ad_id?: string
          ad_name: string
          ad_type: string
          content_url?: string | null
          created_at?: string | null
          display_frequency?: number | null
          is_active?: boolean | null
          position?: string | null
          target_url?: string | null
          updated_at?: string | null
        }
        Update: {
          ad_id?: string
          ad_name?: string
          ad_type?: string
          content_url?: string | null
          created_at?: string | null
          display_frequency?: number | null
          is_active?: boolean | null
          position?: string | null
          target_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics: {
        Row: {
          analytics_id: string
          browser: string | null
          city: string | null
          country: string | null
          device: string | null
          operating_system: string | null
          page_visited: string | null
          state_region: string | null
          visit_timestamp: string | null
        }
        Insert: {
          analytics_id?: string
          browser?: string | null
          city?: string | null
          country?: string | null
          device?: string | null
          operating_system?: string | null
          page_visited?: string | null
          state_region?: string | null
          visit_timestamp?: string | null
        }
        Update: {
          analytics_id?: string
          browser?: string | null
          city?: string | null
          country?: string | null
          device?: string | null
          operating_system?: string | null
          page_visited?: string | null
          state_region?: string | null
          visit_timestamp?: string | null
        }
        Relationships: []
      }
      download_links: {
        Row: {
          created_at: string | null
          download_url: string
          file_size: string
          link_id: string
          movie_id: string | null
          quality: string
        }
        Insert: {
          created_at?: string | null
          download_url: string
          file_size: string
          link_id?: string
          movie_id?: string | null
          quality: string
        }
        Update: {
          created_at?: string | null
          download_url?: string
          file_size?: string
          link_id?: string
          movie_id?: string | null
          quality?: string
        }
        Relationships: [
          {
            foreignKeyName: "download_links_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["movie_id"]
          },
        ]
      }
      media_clips: {
        Row: {
          clip_id: string
          clip_title: string | null
          clip_type: string
          created_at: string | null
          movie_id: string | null
          thumbnail_url: string | null
          video_url: string
        }
        Insert: {
          clip_id?: string
          clip_title?: string | null
          clip_type: string
          created_at?: string | null
          movie_id?: string | null
          thumbnail_url?: string | null
          video_url: string
        }
        Update: {
          clip_id?: string
          clip_title?: string | null
          clip_type?: string
          created_at?: string | null
          movie_id?: string | null
          thumbnail_url?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_clips_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["movie_id"]
          },
        ]
      }
      movie_cast: {
        Row: {
          actor_name: string
          actor_role: string | null
          cast_id: string
          created_at: string | null
          movie_id: string | null
        }
        Insert: {
          actor_name: string
          actor_role?: string | null
          cast_id?: string
          created_at?: string | null
          movie_id?: string | null
        }
        Update: {
          actor_name?: string
          actor_role?: string | null
          cast_id?: string
          created_at?: string | null
          movie_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movie_cast_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["movie_id"]
          },
        ]
      }
      movies: {
        Row: {
          content_type: string
          country: string | null
          created_at: string | null
          director: string | null
          downloads: number | null
          featured: boolean | null
          genre: string[] | null
          imdb_rating: number | null
          movie_id: string
          poster_url: string | null
          production_house: string | null
          quality: string | null
          seo_tags: string[] | null
          storyline: string | null
          title: string
          updated_at: string | null
          user_rating: number | null
          year: number | null
        }
        Insert: {
          content_type: string
          country?: string | null
          created_at?: string | null
          director?: string | null
          downloads?: number | null
          featured?: boolean | null
          genre?: string[] | null
          imdb_rating?: number | null
          movie_id?: string
          poster_url?: string | null
          production_house?: string | null
          quality?: string | null
          seo_tags?: string[] | null
          storyline?: string | null
          title: string
          updated_at?: string | null
          user_rating?: number | null
          year?: number | null
        }
        Update: {
          content_type?: string
          country?: string | null
          created_at?: string | null
          director?: string | null
          downloads?: number | null
          featured?: boolean | null
          genre?: string[] | null
          imdb_rating?: number | null
          movie_id?: string
          poster_url?: string | null
          production_house?: string | null
          quality?: string | null
          seo_tags?: string[] | null
          storyline?: string | null
          title?: string
          updated_at?: string | null
          user_rating?: number | null
          year?: number | null
        }
        Relationships: []
      }
      shorts: {
        Row: {
          created_at: string | null
          short_id: string
          thumbnail_url: string | null
          title: string
          video_url: string
        }
        Insert: {
          created_at?: string | null
          short_id?: string
          thumbnail_url?: string | null
          title: string
          video_url: string
        }
        Update: {
          created_at?: string | null
          short_id?: string
          thumbnail_url?: string | null
          title?: string
          video_url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          auth_user_id: string
          created_at: string | null
          role_id: string
          role_name: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string | null
          role_id?: string
          role_name: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string | null
          role_id?: string
          role_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      search_movies: {
        Args: { search_term: string }
        Returns: {
          content_type: string
          country: string | null
          created_at: string | null
          director: string | null
          downloads: number | null
          featured: boolean | null
          genre: string[] | null
          imdb_rating: number | null
          movie_id: string
          poster_url: string | null
          production_house: string | null
          quality: string | null
          seo_tags: string[] | null
          storyline: string | null
          title: string
          updated_at: string | null
          user_rating: number | null
          year: number | null
        }[]
      }
      search_series: {
        Args: { search_term: string }
        Returns: {
          content_type: string
          country: string | null
          created_at: string | null
          director: string | null
          downloads: number | null
          featured: boolean | null
          genre: string[] | null
          imdb_rating: number | null
          movie_id: string
          poster_url: string | null
          production_house: string | null
          quality: string | null
          seo_tags: string[] | null
          storyline: string | null
          title: string
          updated_at: string | null
          user_rating: number | null
          year: number | null
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
