/**
 * Pawgress Database Types — generiert aus schema.sql
 * Wird verwendet als: createClient<Database>(url, key)
 * Fix: verhindert "never"-Inferenz bei Supabase-Rückgaben
 */
export interface Database {
  public: {
    Tables: {
      user_stats: {
        Row: {
          user_id:      string;
          stats:        Record<string, unknown>;
          week_days:    boolean[];
          weekly_goal:  number;
          updated_at:   string;
        };
        Insert: {
          user_id:      string;
          stats?:       Record<string, unknown>;
          week_days?:   boolean[];
          weekly_goal?: number;
          updated_at?:  string;
        };
        Update: {
          user_id?:     string;
          stats?:       Record<string, unknown>;
          week_days?:   boolean[];
          weekly_goal?: number;
          updated_at?:  string;
        };
      };

      user_profile: {
        Row: {
          user_id:    string;
          profile:    Record<string, unknown>;
          updated_at: string;
        };
        Insert: {
          user_id:    string;
          profile?:   Record<string, unknown>;
          updated_at?: string;
        };
        Update: {
          user_id?:   string;
          profile?:   Record<string, unknown>;
          updated_at?: string;
        };
      };

      user_coaches: {
        Row: {
          user_id:        string;
          selected_coach: string;
          coach_progress: Record<string, unknown>;
          updated_at:     string;
        };
        Insert: {
          user_id:         string;
          selected_coach?: string;
          coach_progress?: Record<string, unknown>;
          updated_at?:     string;
        };
        Update: {
          user_id?:        string;
          selected_coach?: string;
          coach_progress?: Record<string, unknown>;
          updated_at?:     string;
        };
      };

      workout_entries: {
        Row: {
          id:               string;
          user_id:          string;
          date:             string;
          day_label:        string;
          day_tag:          string;
          plan_id:          string | null;
          is_freestyle:     boolean;
          duration_seconds: number;
          total_volume:     number;
          total_sets:       number;
          total_reps:       number;
          exercises:        unknown;
          created_at:       string;
        };
        Insert: {
          id:               string;
          user_id:          string;
          date:             string;
          day_label:        string;
          day_tag:          string;
          plan_id?:         string | null;
          is_freestyle?:    boolean;
          duration_seconds: number;
          total_volume:     number;
          total_sets:       number;
          total_reps:       number;
          exercises:        unknown;
          created_at?:      string;
        };
        Update: Partial<Database["public"]["Tables"]["workout_entries"]["Insert"]>;
      };

      user_personal_records: {
        Row: {
          user_id:    string;
          records:    Record<string, number>;
          updated_at: string;
        };
        Insert: {
          user_id:     string;
          records?:    Record<string, number>;
          updated_at?: string;
        };
        Update: {
          user_id?:    string;
          records?:    Record<string, number>;
          updated_at?: string;
        };
      };

      user_custom_plans: {
        Row: {
          id:           string;
          user_id:      string;
          name:         string;
          description:  string | null;
          icon:         string | null;
          color:        string | null;
          days_per_week: number;
          focus:        string | null;
          days:         unknown;
          is_active:    boolean;
          updated_at:   string;
          created_at:   string;
        };
        Insert: {
          id:            string;
          user_id:       string;
          name:          string;
          description?:  string | null;
          icon?:         string | null;
          color?:        string | null;
          days_per_week?: number;
          focus?:        string | null;
          days?:         unknown;
          is_active?:    boolean;
          updated_at?:   string;
          created_at?:   string;
        };
        Update: Partial<Database["public"]["Tables"]["user_custom_plans"]["Insert"]>;
      };

      user_standalone_workouts: {
        Row: {
          id:          string;
          user_id:     string;
          name:        string;
          description: string | null;
          exercises:   unknown;
          updated_at:  string;
          created_at:  string;
        };
        Insert: {
          id:           string;
          user_id:      string;
          name:         string;
          description?: string | null;
          exercises?:   unknown;
          updated_at?:  string;
          created_at?:  string;
        };
        Update: Partial<Database["public"]["Tables"]["user_standalone_workouts"]["Insert"]>;
      };

      user_active_plan: {
        Row: {
          user_id:        string;
          active_plan_id: string;
          updated_at:     string;
        };
        Insert: {
          user_id:         string;
          active_plan_id?: string;
          updated_at?:     string;
        };
        Update: {
          user_id?:        string;
          active_plan_id?: string;
          updated_at?:     string;
        };
      };
    };
    Views:   Record<string, never>;
    Functions: Record<string, never>;
    Enums:   Record<string, never>;
  };
}
