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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ad_clicks: {
        Row: {
          ad_id: string | null
          clicked_at: string | null
          id: string
          interstitial_ad_id: string | null
          referrer_page: string | null
          user_agent: string | null
          user_ip: string | null
        }
        Insert: {
          ad_id?: string | null
          clicked_at?: string | null
          id?: string
          interstitial_ad_id?: string | null
          referrer_page?: string | null
          user_agent?: string | null
          user_ip?: string | null
        }
        Update: {
          ad_id?: string | null
          clicked_at?: string | null
          id?: string
          interstitial_ad_id?: string | null
          referrer_page?: string | null
          user_agent?: string | null
          user_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_clicks_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["ad_id"]
          },
          {
            foreignKeyName: "ad_clicks_interstitial_ad_id_fkey"
            columns: ["interstitial_ad_id"]
            isOneToOne: false
            referencedRelation: "interstitial_ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_placements: {
        Row: {
          ad_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          page_type: string
          position: string
          updated_at: string | null
        }
        Insert: {
          ad_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          page_type: string
          position: string
          updated_at?: string | null
        }
        Update: {
          ad_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          page_type?: string
          position?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ad_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ads: {
        Row: {
          ad_id: string
          ad_name: string
          ad_type: string
          click_based: boolean | null
          clicks: number | null
          content_url: string | null
          conversions: number | null
          created_at: string | null
          description: string | null
          display_frequency: number | null
          end_date: string | null
          impressions: number | null
          is_active: boolean | null
          position: string | null
          revenue: number | null
          skip_delay: number | null
          skip_enabled: boolean | null
          start_date: string | null
          target_countries: string[] | null
          target_devices: string[] | null
          target_url: string | null
          updated_at: string | null
          view_duration: number | null
        }
        Insert: {
          ad_id?: string
          ad_name: string
          ad_type: string
          click_based?: boolean | null
          clicks?: number | null
          content_url?: string | null
          conversions?: number | null
          created_at?: string | null
          description?: string | null
          display_frequency?: number | null
          end_date?: string | null
          impressions?: number | null
          is_active?: boolean | null
          position?: string | null
          revenue?: number | null
          skip_delay?: number | null
          skip_enabled?: boolean | null
          start_date?: string | null
          target_countries?: string[] | null
          target_devices?: string[] | null
          target_url?: string | null
          updated_at?: string | null
          view_duration?: number | null
        }
        Update: {
          ad_id?: string
          ad_name?: string
          ad_type?: string
          click_based?: boolean | null
          clicks?: number | null
          content_url?: string | null
          conversions?: number | null
          created_at?: string | null
          description?: string | null
          display_frequency?: number | null
          end_date?: string | null
          impressions?: number | null
          is_active?: boolean | null
          position?: string | null
          revenue?: number | null
          skip_delay?: number | null
          skip_enabled?: boolean | null
          start_date?: string | null
          target_countries?: string[] | null
          target_devices?: string[] | null
          target_url?: string | null
          updated_at?: string | null
          view_duration?: number | null
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
          os: string | null
          page_visited: string | null
          state_region: string | null
          user_id: string | null
          visit_timestamp: string | null
        }
        Insert: {
          analytics_id?: string
          browser?: string | null
          city?: string | null
          country?: string | null
          device?: string | null
          operating_system?: string | null
          os?: string | null
          page_visited?: string | null
          state_region?: string | null
          user_id?: string | null
          visit_timestamp?: string | null
        }
        Update: {
          analytics_id?: string
          browser?: string | null
          city?: string | null
          country?: string | null
          device?: string | null
          operating_system?: string | null
          os?: string | null
          page_visited?: string | null
          state_region?: string | null
          user_id?: string | null
          visit_timestamp?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      download_episodes: {
        Row: {
          created_at: string | null
          episode_id: string
          episode_number: string
          episode_title: string | null
          link_id: string | null
        }
        Insert: {
          created_at?: string | null
          episode_id?: string
          episode_number: string
          episode_title?: string | null
          link_id?: string | null
        }
        Update: {
          created_at?: string | null
          episode_id?: string
          episode_number?: string
          episode_title?: string | null
          link_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "download_episodes_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "download_links"
            referencedColumns: ["link_id"]
          },
        ]
      }
      download_links: {
        Row: {
          created_at: string | null
          download_url: string
          file_size: string
          file_size_gb: number | null
          link_id: string
          movie_id: string | null
          quality: string
          resolution: string | null
        }
        Insert: {
          created_at?: string | null
          download_url: string
          file_size: string
          file_size_gb?: number | null
          link_id?: string
          movie_id?: string | null
          quality: string
          resolution?: string | null
        }
        Update: {
          created_at?: string | null
          download_url?: string
          file_size?: string
          file_size_gb?: number | null
          link_id?: string
          movie_id?: string | null
          quality?: string
          resolution?: string | null
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
      download_mirrors: {
        Row: {
          created_at: string | null
          display_order: number | null
          episode_id: string | null
          link_id: string | null
          mirror_id: string
          mirror_url: string
          source_id: string | null
          source_name: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          episode_id?: string | null
          link_id?: string | null
          mirror_id?: string
          mirror_url: string
          source_id?: string | null
          source_name: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          episode_id?: string | null
          link_id?: string | null
          mirror_id?: string
          mirror_url?: string
          source_id?: string | null
          source_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "download_mirrors_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "download_episodes"
            referencedColumns: ["episode_id"]
          },
          {
            foreignKeyName: "download_mirrors_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "download_links"
            referencedColumns: ["link_id"]
          },
          {
            foreignKeyName: "download_mirrors_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "download_sources"
            referencedColumns: ["source_id"]
          },
        ]
      }
      download_sources: {
        Row: {
          created_at: string | null
          icon_url: string | null
          name: string
          source_id: string
        }
        Insert: {
          created_at?: string | null
          icon_url?: string | null
          name: string
          source_id?: string
        }
        Update: {
          created_at?: string | null
          icon_url?: string | null
          name?: string
          source_id?: string
        }
        Relationships: []
      }
      genres: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      interstitial_ads: {
        Row: {
          ad_content_url: string | null
          ad_name: string
          created_at: string | null
          display_duration: number | null
          id: string
          is_active: boolean | null
          skip_after: number | null
          target_url: string | null
          trigger_event: string
          updated_at: string | null
        }
        Insert: {
          ad_content_url?: string | null
          ad_name: string
          created_at?: string | null
          display_duration?: number | null
          id?: string
          is_active?: boolean | null
          skip_after?: number | null
          target_url?: string | null
          trigger_event: string
          updated_at?: string | null
        }
        Update: {
          ad_content_url?: string | null
          ad_name?: string
          created_at?: string | null
          display_duration?: number | null
          id?: string
          is_active?: boolean | null
          skip_after?: number | null
          target_url?: string | null
          trigger_event?: string
          updated_at?: string | null
        }
        Relationships: []
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
          content_type: string | null
          country: string | null
          created_at: string | null
          director: string | null
          downloads: number | null
          featured: boolean | null
          genre: string[] | null
          imdb_rating: number | null
          is_latest: boolean | null
          is_visible: boolean | null
          movie_id: string
          poster_url: string | null
          production_house: string | null
          quality: string | null
          release_date: string | null
          screenshots: string[] | null
          seo_tags: string[] | null
          storyline: string | null
          title: string
          trailer_url: string | null
          trending: boolean | null
          updated_at: string | null
          user_rating: number | null
          year: number | null
        }
        Insert: {
          content_type?: string | null
          country?: string | null
          created_at?: string | null
          director?: string | null
          downloads?: number | null
          featured?: boolean | null
          genre?: string[] | null
          imdb_rating?: number | null
          is_latest?: boolean | null
          is_visible?: boolean | null
          movie_id?: string
          poster_url?: string | null
          production_house?: string | null
          quality?: string | null
          release_date?: string | null
          screenshots?: string[] | null
          seo_tags?: string[] | null
          storyline?: string | null
          title: string
          trailer_url?: string | null
          trending?: boolean | null
          updated_at?: string | null
          user_rating?: number | null
          year?: number | null
        }
        Update: {
          content_type?: string | null
          country?: string | null
          created_at?: string | null
          director?: string | null
          downloads?: number | null
          featured?: boolean | null
          genre?: string[] | null
          imdb_rating?: number | null
          is_latest?: boolean | null
          is_visible?: boolean | null
          movie_id?: string
          poster_url?: string | null
          production_house?: string | null
          quality?: string | null
          release_date?: string | null
          screenshots?: string[] | null
          seo_tags?: string[] | null
          storyline?: string | null
          title?: string
          trailer_url?: string | null
          trending?: boolean | null
          updated_at?: string | null
          user_rating?: number | null
          year?: number | null
        }
        Relationships: []
      }
      shorts: {
        Row: {
          created_at: string | null
          duration: number | null
          is_visible: boolean | null
          short_id: string
          thumbnail_url: string | null
          title: string
          video_file_url: string | null
          video_url: string
          youtube_url: string | null
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          is_visible?: boolean | null
          short_id?: string
          thumbnail_url?: string | null
          title: string
          video_file_url?: string | null
          video_url: string
          youtube_url?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          is_visible?: boolean | null
          short_id?: string
          thumbnail_url?: string | null
          title?: string
          video_file_url?: string | null
          video_url?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      uploaded_images: {
        Row: {
          content_type: string | null
          created_at: string | null
          file_path: string
          file_size: number | null
          filename: string
          id: string
          uploaded_by: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          file_path: string
          file_size?: number | null
          filename: string
          id?: string
          uploaded_by?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          filename?: string
          id?: string
          uploaded_by?: string | null
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
      video_ads: {
        Row: {
          ad_name: string
          created_at: string | null
          duration: number
          id: string
          is_active: boolean | null
          skip_after: number | null
          target_url: string | null
          trigger_events: string[] | null
          updated_at: string | null
          video_url: string
        }
        Insert: {
          ad_name: string
          created_at?: string | null
          duration?: number
          id?: string
          is_active?: boolean | null
          skip_after?: number | null
          target_url?: string | null
          trigger_events?: string[] | null
          updated_at?: string | null
          video_url: string
        }
        Update: {
          ad_name?: string
          created_at?: string | null
          duration?: number
          id?: string
          is_active?: boolean | null
          skip_after?: number | null
          target_url?: string | null
          trigger_events?: string[] | null
          updated_at?: string | null
          video_url?: string
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
        Args: Record<PropertyKey, never> | { search_term: string }
        Returns: undefined
      }
      search_series: {
        Args: Record<PropertyKey, never> | { search_term: string }
        Returns: undefined
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
