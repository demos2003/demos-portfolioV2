export type Database = {
  public: {
    Views: Record<string, never>
    Functions: Record<string, never>
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string | null
          technologies: string[]
          live_url: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url?: string | null
          technologies?: string[]
          live_url?: string | null
          display_order?: number
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          excerpt: string
          image_url: string | null
          post_date: string
          read_time: string
          tags: string[]
          url: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          excerpt: string
          image_url?: string | null
          post_date: string
          read_time: string
          tags?: string[]
          url: string
          display_order?: number
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>
        Relationships: []
      }
      skill_categories: {
        Row: {
          id: string
          title: string
          color: string
          display_order: number
        }
        Insert: {
          id?: string
          title: string
          color?: string
          display_order?: number
        }
        Update: Partial<Database["public"]["Tables"]["skill_categories"]["Insert"]>
        Relationships: []
      }
      skills: {
        Row: {
          id: string
          category_id: string
          name: string
          display_order: number
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          display_order?: number
        }
        Update: Partial<Database["public"]["Tables"]["skills"]["Insert"]>
        Relationships: []
      }
      about_stats: {
        Row: {
          id: string
          label: string
          value: string
          display_order: number
        }
        Insert: {
          id?: string
          label: string
          value: string
          display_order?: number
        }
        Update: Partial<Database["public"]["Tables"]["about_stats"]["Insert"]>
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          value: unknown
        }
        Insert: {
          key: string
          value: unknown
        }
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>
        Relationships: []
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["contact_submissions"]["Insert"]>
        Relationships: []
      }
    }
  }
}
