export type Database = {
  public: {
    Tables: {
      teams: {
        Row: { id: string; name: string; sort_order: number };
        Insert: { id?: string; name: string; sort_order?: number };
        Update: { id?: string; name?: string; sort_order?: number };
        Relationships: [];
      };
      volunteers: {
        Row: {
          id: string;
          name: string;
          nickname: string | null;
          instruments: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          nickname?: string | null;
          instruments?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          nickname?: string | null;
          instruments?: string[];
          created_at?: string;
        };
        Relationships: [];
      };
      roles: {
        Row: { id: string; name: string; instrument: string | null; sort_order: number };
        Insert: {
          id?: string;
          name: string;
          instrument?: string | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          name?: string;
          instrument?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          service_date: string;
          title: string | null;
          notes: string | null;
          archived: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          service_date: string;
          title?: string | null;
          notes?: string | null;
          archived?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          service_date?: string;
          title?: string | null;
          notes?: string | null;
          archived?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      service_lineup_assignments: {
        Row: {
          id: string;
          service_id: string;
          team_id: string;
          role_id: string;
          person_id: string | null;
        };
        Insert: {
          id?: string;
          service_id: string;
          team_id: string;
          role_id: string;
          person_id?: string | null;
        };
        Update: {
          id?: string;
          service_id?: string;
          team_id?: string;
          role_id?: string;
          person_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "service_lineup_assignments_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_lineup_assignments_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_lineup_assignments_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_lineup_assignments_person_id_fkey";
            columns: ["person_id"];
            isOneToOne: false;
            referencedRelation: "volunteers";
            referencedColumns: ["id"];
          },
        ];
      };
      songs: {
        Row: {
          id: string;
          service_id: string;
          name: string;
          singer_or_band: string | null;
          version: string | null;
          url: string | null;
          key: string | null;
          bpm: number | null;
          time_signature_numerator: number;
          time_signature_denominator: number;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          service_id: string;
          name: string;
          singer_or_band?: string | null;
          version?: string | null;
          url?: string | null;
          key?: string | null;
          bpm?: number | null;
          time_signature_numerator?: number;
          time_signature_denominator?: number;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          service_id?: string;
          name?: string;
          singer_or_band?: string | null;
          version?: string | null;
          url?: string | null;
          key?: string | null;
          bpm?: number | null;
          time_signature_numerator?: number;
          time_signature_denominator?: number;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "songs_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      playlists: {
        Row: {
          id: string;
          service_id: string;
          url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          service_id: string;
          url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          service_id?: string;
          url?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "playlists_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
