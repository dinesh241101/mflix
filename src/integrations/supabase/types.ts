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
          ad_type: string
          content_url: string | null
          created_at: string | null
          display_frequency: number | null
          id: string
          is_active: boolean | null
          name: string
          position: string | null
          target_url: string | null
          updated_at: string | null
        }
        Insert: {
          ad_type: string
          content_url?: string | null
          created_at?: string | null
          display_frequency?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          position?: string | null
          target_url?: string | null
          updated_at?: string | null
        }
        Update: {
          ad_type?: string
          content_url?: string | null
          created_at?: string | null
          display_frequency?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          position?: string | null
          target_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          device: string | null
          id: string
          os: string | null
          page_visited: string | null
          state: string | null
          visit_timestamp: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          device?: string | null
          id?: string
          os?: string | null
          page_visited?: string | null
          state?: string | null
          visit_timestamp?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          device?: string | null
          id?: string
          os?: string | null
          page_visited?: string | null
          state?: string | null
          visit_timestamp?: string | null
        }
        Relationships: []
      }
      download_links: {
        Row: {
          created_at: string | null
          id: string
          movie_id: string | null
          quality: string
          size: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          movie_id?: string | null
          quality: string
          size: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          movie_id?: string | null
          quality?: string
          size?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "download_links_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      media_clips: {
        Row: {
          created_at: string | null
          id: string
          movie_id: string | null
          thumbnail_url: string | null
          title: string | null
          type: string
          video_url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          movie_id?: string | null
          thumbnail_url?: string | null
          title?: string | null
          type: string
          video_url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          movie_id?: string | null
          thumbnail_url?: string | null
          title?: string | null
          type?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_clips_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      movie_cast: {
        Row: {
          created_at: string | null
          id: string
          movie_id: string | null
          name: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          movie_id?: string | null
          name: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          movie_id?: string | null
          name?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movie_cast_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
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
          id: string
          imdb_rating: number | null
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
          id?: string
          imdb_rating?: number | null
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
          id?: string
          imdb_rating?: number | null
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
          id: string
          thumbnail_url: string | null
          title: string
          video_url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          thumbnail_url?: string | null
          title: string
          video_url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          video_url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
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
          id: string
          imdb_rating: number | null
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
          id: string
          imdb_rating: number | null
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
