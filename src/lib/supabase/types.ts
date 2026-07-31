export type Database = {
  public: {
    Tables: {
      people: {
        Row: { id: string; name: string; created_at: string };
        Insert: { id?: string; name: string; created_at?: string };
        Update: { id?: string; name?: string; created_at?: string };
        Relationships: [];
      };
      roles: {
        Row: { id: string; name: string; sort_order: number };
        Insert: { id?: string; name: string; sort_order?: number };
        Update: { id?: string; name?: string; sort_order?: number };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          service_date: string;
          title: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          service_date: string;
          title?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          service_date?: string;
          title?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      lineup_assignments: {
        Row: {
          id: string;
          service_id: string;
          role_id: string;
          person_id: string | null;
        };
        Insert: {
          id?: string;
          service_id: string;
          role_id: string;
          person_id?: string | null;
        };
        Update: {
          id?: string;
          service_id?: string;
          role_id?: string;
          person_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lineup_assignments_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lineup_assignments_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lineup_assignments_person_id_fkey";
            columns: ["person_id"];
            isOneToOne: false;
            referencedRelation: "people";
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
