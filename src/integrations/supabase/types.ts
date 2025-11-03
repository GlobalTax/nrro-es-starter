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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string | null
          actor: string | null
          created_at: string | null
          data: Json | null
          entity: string | null
          entity_id: string | null
          id: string
        }
        Insert: {
          action?: string | null
          actor?: string | null
          created_at?: string | null
          data?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: string
        }
        Update: {
          action?: string | null
          actor?: string | null
          created_at?: string | null
          data?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: string
        }
        Relationships: []
      }
      blog_post_state_changes: {
        Row: {
          changed_at: string | null
          changed_by: string
          from_status: string | null
          id: string
          notes: string | null
          post_id: string
          to_status: string
        }
        Insert: {
          changed_at?: string | null
          changed_by: string
          from_status?: string | null
          id?: string
          notes?: string | null
          post_id: string
          to_status: string
        }
        Update: {
          changed_at?: string | null
          changed_by?: string
          from_status?: string | null
          id?: string
          notes?: string | null
          post_id?: string
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_state_changes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          author_name: string | null
          author_specialization: string | null
          category: string | null
          content_en: string | null
          content_es: string | null
          created_at: string | null
          excerpt_en: string | null
          excerpt_es: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          read_time: number | null
          scheduled_at: string | null
          seo_description_en: string | null
          seo_description_es: string | null
          seo_title_en: string | null
          seo_title_es: string | null
          slug_en: string | null
          slug_es: string
          status: string
          tags: string[] | null
          title_en: string | null
          title_es: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          author_name?: string | null
          author_specialization?: string | null
          category?: string | null
          content_en?: string | null
          content_es?: string | null
          created_at?: string | null
          excerpt_en?: string | null
          excerpt_es?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          read_time?: number | null
          scheduled_at?: string | null
          seo_description_en?: string | null
          seo_description_es?: string | null
          seo_title_en?: string | null
          seo_title_es?: string | null
          slug_en?: string | null
          slug_es: string
          status?: string
          tags?: string[] | null
          title_en?: string | null
          title_es: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          author_name?: string | null
          author_specialization?: string | null
          category?: string | null
          content_en?: string | null
          content_es?: string | null
          created_at?: string | null
          excerpt_en?: string | null
          excerpt_es?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          read_time?: number | null
          scheduled_at?: string | null
          seo_description_en?: string | null
          seo_description_es?: string | null
          seo_title_en?: string | null
          seo_title_es?: string | null
          slug_en?: string | null
          slug_es?: string
          status?: string
          tags?: string[] | null
          title_en?: string | null
          title_es?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      candidatos: {
        Row: {
          anos_experiencia: number | null
          created_at: string | null
          created_by: string | null
          cv_url: string | null
          departamento: string | null
          email: string
          empleado_id: string | null
          empresa_actual: string | null
          estado: string | null
          fecha_disponibilidad: string | null
          fuente: string | null
          id: string
          idiomas: string[] | null
          job_position_id: string | null
          linkedin_url: string | null
          nivel_estudios: string | null
          nombre: string
          notas: string | null
          preferencia_trabajo: string | null
          puesto_actual: string | null
          puesto_solicitado: string
          salario_esperado: number | null
          skills: string[] | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          anos_experiencia?: number | null
          created_at?: string | null
          created_by?: string | null
          cv_url?: string | null
          departamento?: string | null
          email: string
          empleado_id?: string | null
          empresa_actual?: string | null
          estado?: string | null
          fecha_disponibilidad?: string | null
          fuente?: string | null
          id?: string
          idiomas?: string[] | null
          job_position_id?: string | null
          linkedin_url?: string | null
          nivel_estudios?: string | null
          nombre: string
          notas?: string | null
          preferencia_trabajo?: string | null
          puesto_actual?: string | null
          puesto_solicitado: string
          salario_esperado?: number | null
          skills?: string[] | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          anos_experiencia?: number | null
          created_at?: string | null
          created_by?: string | null
          cv_url?: string | null
          departamento?: string | null
          email?: string
          empleado_id?: string | null
          empresa_actual?: string | null
          estado?: string | null
          fecha_disponibilidad?: string | null
          fuente?: string | null
          id?: string
          idiomas?: string[] | null
          job_position_id?: string | null
          linkedin_url?: string | null
          nivel_estudios?: string | null
          nombre?: string
          notas?: string | null
          preferencia_trabajo?: string | null
          puesto_actual?: string | null
          puesto_solicitado?: string
          salario_esperado?: number | null
          skills?: string[] | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidatos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidatos_empleado_id_fkey"
            columns: ["empleado_id"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidatos_job_position_id_fkey"
            columns: ["job_position_id"]
            isOneToOne: false
            referencedRelation: "job_positions"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          challenge: string
          challenge_ca: string | null
          challenge_en: string | null
          challenge_es: string | null
          client_industry: string
          client_logo_url: string | null
          client_name: string
          client_size: string | null
          created_at: string | null
          created_by: string | null
          detailed_content: string | null
          detailed_content_ca: string | null
          detailed_content_en: string | null
          detailed_content_es: string | null
          display_order: number | null
          gallery: Json | null
          hero_image_url: string | null
          hero_subtitle: string | null
          hero_subtitle_ca: string | null
          hero_subtitle_en: string | null
          hero_subtitle_es: string | null
          hero_title: string
          hero_title_ca: string | null
          hero_title_en: string | null
          hero_title_es: string | null
          id: string
          is_featured: boolean | null
          meta_description: string | null
          meta_description_ca: string | null
          meta_description_en: string | null
          meta_description_es: string | null
          meta_title: string | null
          meta_title_ca: string | null
          meta_title_en: string | null
          meta_title_es: string | null
          metrics: Json | null
          primary_service: string | null
          project_duration: string | null
          published_at: string | null
          related_services: string[] | null
          results_summary: string
          results_summary_ca: string | null
          results_summary_en: string | null
          results_summary_es: string | null
          slug: string
          slug_ca: string | null
          slug_en: string | null
          slug_es: string | null
          solution: string
          solution_ca: string | null
          solution_en: string | null
          solution_es: string | null
          status: Database["public"]["Enums"]["case_study_status"]
          tags: string[] | null
          testimonial_author: string | null
          testimonial_avatar_url: string | null
          testimonial_position: string | null
          testimonial_text: string | null
          testimonial_text_ca: string | null
          testimonial_text_en: string | null
          testimonial_text_es: string | null
          timeline: Json | null
          title: string
          title_ca: string | null
          title_en: string | null
          title_es: string | null
          updated_at: string | null
          updated_by: string | null
          view_count: number | null
        }
        Insert: {
          challenge: string
          challenge_ca?: string | null
          challenge_en?: string | null
          challenge_es?: string | null
          client_industry: string
          client_logo_url?: string | null
          client_name: string
          client_size?: string | null
          created_at?: string | null
          created_by?: string | null
          detailed_content?: string | null
          detailed_content_ca?: string | null
          detailed_content_en?: string | null
          detailed_content_es?: string | null
          display_order?: number | null
          gallery?: Json | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_subtitle_ca?: string | null
          hero_subtitle_en?: string | null
          hero_subtitle_es?: string | null
          hero_title: string
          hero_title_ca?: string | null
          hero_title_en?: string | null
          hero_title_es?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          meta_description_ca?: string | null
          meta_description_en?: string | null
          meta_description_es?: string | null
          meta_title?: string | null
          meta_title_ca?: string | null
          meta_title_en?: string | null
          meta_title_es?: string | null
          metrics?: Json | null
          primary_service?: string | null
          project_duration?: string | null
          published_at?: string | null
          related_services?: string[] | null
          results_summary: string
          results_summary_ca?: string | null
          results_summary_en?: string | null
          results_summary_es?: string | null
          slug: string
          slug_ca?: string | null
          slug_en?: string | null
          slug_es?: string | null
          solution: string
          solution_ca?: string | null
          solution_en?: string | null
          solution_es?: string | null
          status?: Database["public"]["Enums"]["case_study_status"]
          tags?: string[] | null
          testimonial_author?: string | null
          testimonial_avatar_url?: string | null
          testimonial_position?: string | null
          testimonial_text?: string | null
          testimonial_text_ca?: string | null
          testimonial_text_en?: string | null
          testimonial_text_es?: string | null
          timeline?: Json | null
          title: string
          title_ca?: string | null
          title_en?: string | null
          title_es?: string | null
          updated_at?: string | null
          updated_by?: string | null
          view_count?: number | null
        }
        Update: {
          challenge?: string
          challenge_ca?: string | null
          challenge_en?: string | null
          challenge_es?: string | null
          client_industry?: string
          client_logo_url?: string | null
          client_name?: string
          client_size?: string | null
          created_at?: string | null
          created_by?: string | null
          detailed_content?: string | null
          detailed_content_ca?: string | null
          detailed_content_en?: string | null
          detailed_content_es?: string | null
          display_order?: number | null
          gallery?: Json | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_subtitle_ca?: string | null
          hero_subtitle_en?: string | null
          hero_subtitle_es?: string | null
          hero_title?: string
          hero_title_ca?: string | null
          hero_title_en?: string | null
          hero_title_es?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          meta_description_ca?: string | null
          meta_description_en?: string | null
          meta_description_es?: string | null
          meta_title?: string | null
          meta_title_ca?: string | null
          meta_title_en?: string | null
          meta_title_es?: string | null
          metrics?: Json | null
          primary_service?: string | null
          project_duration?: string | null
          published_at?: string | null
          related_services?: string[] | null
          results_summary?: string
          results_summary_ca?: string | null
          results_summary_en?: string | null
          results_summary_es?: string | null
          slug?: string
          slug_ca?: string | null
          slug_en?: string | null
          slug_es?: string | null
          solution?: string
          solution_ca?: string | null
          solution_en?: string | null
          solution_es?: string | null
          status?: Database["public"]["Enums"]["case_study_status"]
          tags?: string[] | null
          testimonial_author?: string | null
          testimonial_avatar_url?: string | null
          testimonial_position?: string | null
          testimonial_text?: string | null
          testimonial_text_ca?: string | null
          testimonial_text_en?: string | null
          testimonial_text_es?: string | null
          timeline?: Json | null
          title?: string
          title_ca?: string | null
          title_en?: string | null
          title_es?: string | null
          updated_at?: string | null
          updated_by?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      cierres_nomina: {
        Row: {
          anio: number
          created_at: string | null
          created_by: string | null
          desviacion: number | null
          estado: string
          fecha_cierre: string | null
          fecha_comparacion: string | null
          fecha_inicio: string | null
          id: string
          mes: number
          observaciones: string | null
          responsable: string | null
          total_previsto: number | null
          total_real: number | null
          updated_at: string | null
        }
        Insert: {
          anio: number
          created_at?: string | null
          created_by?: string | null
          desviacion?: number | null
          estado?: string
          fecha_cierre?: string | null
          fecha_comparacion?: string | null
          fecha_inicio?: string | null
          id?: string
          mes: number
          observaciones?: string | null
          responsable?: string | null
          total_previsto?: number | null
          total_real?: number | null
          updated_at?: string | null
        }
        Update: {
          anio?: number
          created_at?: string | null
          created_by?: string | null
          desviacion?: number | null
          estado?: string
          fecha_cierre?: string | null
          fecha_comparacion?: string | null
          fecha_inicio?: string | null
          id?: string
          mes?: number
          observaciones?: string | null
          responsable?: string | null
          total_previsto?: number | null
          total_real?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cierres_nomina_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comparativas_nomina: {
        Row: {
          bruto_previsto: number | null
          bruto_real: number | null
          cierre_id: string
          coste_previsto: number | null
          coste_real: number | null
          created_at: string | null
          diferencia_bruto: number | null
          diferencia_coste: number | null
          discrepancia: boolean | null
          empleado_id: string
          id: string
          nomina_id: string | null
          observaciones: string | null
          porcentaje_desviacion: number | null
        }
        Insert: {
          bruto_previsto?: number | null
          bruto_real?: number | null
          cierre_id: string
          coste_previsto?: number | null
          coste_real?: number | null
          created_at?: string | null
          diferencia_bruto?: number | null
          diferencia_coste?: number | null
          discrepancia?: boolean | null
          empleado_id: string
          id?: string
          nomina_id?: string | null
          observaciones?: string | null
          porcentaje_desviacion?: number | null
        }
        Update: {
          bruto_previsto?: number | null
          bruto_real?: number | null
          cierre_id?: string
          coste_previsto?: number | null
          coste_real?: number | null
          created_at?: string | null
          diferencia_bruto?: number | null
          diferencia_coste?: number | null
          discrepancia?: boolean | null
          empleado_id?: string
          id?: string
          nomina_id?: string | null
          observaciones?: string | null
          porcentaje_desviacion?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comparativas_nomina_cierre_id_fkey"
            columns: ["cierre_id"]
            isOneToOne: false
            referencedRelation: "cierres_nomina"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comparativas_nomina_empleado_id_fkey"
            columns: ["empleado_id"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comparativas_nomina_nomina_id_fkey"
            columns: ["nomina_id"]
            isOneToOne: false
            referencedRelation: "nominas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comparativas_nomina_nomina_id_fkey"
            columns: ["nomina_id"]
            isOneToOne: false
            referencedRelation: "nominas_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_leads: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          email_sent: boolean | null
          id: string
          ip_address: string | null
          message: string
          name: string
          service_type: Database["public"]["Enums"]["service_type"] | null
          subject: string
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          email_sent?: boolean | null
          id?: string
          ip_address?: string | null
          message: string
          name: string
          service_type?: Database["public"]["Enums"]["service_type"] | null
          subject: string
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          email_sent?: boolean | null
          id?: string
          ip_address?: string | null
          message?: string
          name?: string
          service_type?: Database["public"]["Enums"]["service_type"] | null
          subject?: string
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      demo_requests: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
          restaurant_name: string | null
          source: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          restaurant_name?: string | null
          source?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          restaurant_name?: string | null
          source?: string | null
          status?: string | null
        }
        Relationships: []
      }
      empleados: {
        Row: {
          activo: boolean | null
          area: string | null
          avatar_url: string | null
          bonus: number | null
          contrato_url: string | null
          coste_seg_social: number | null
          coste_total_anual: number | null
          coste_total_mensual: number | null
          created_at: string | null
          departamento: string | null
          email: string | null
          fecha_alta: string | null
          fecha_baja: string | null
          firma_url: string | null
          id: string
          nif: string | null
          nombre: string
          notas: string | null
          oficina: string | null
          puesto: string | null
          rol: string | null
          salario_base: number | null
          tipo_contrato: string | null
          variable: number | null
        }
        Insert: {
          activo?: boolean | null
          area?: string | null
          avatar_url?: string | null
          bonus?: number | null
          contrato_url?: string | null
          coste_seg_social?: number | null
          coste_total_anual?: number | null
          coste_total_mensual?: number | null
          created_at?: string | null
          departamento?: string | null
          email?: string | null
          fecha_alta?: string | null
          fecha_baja?: string | null
          firma_url?: string | null
          id?: string
          nif?: string | null
          nombre: string
          notas?: string | null
          oficina?: string | null
          puesto?: string | null
          rol?: string | null
          salario_base?: number | null
          tipo_contrato?: string | null
          variable?: number | null
        }
        Update: {
          activo?: boolean | null
          area?: string | null
          avatar_url?: string | null
          bonus?: number | null
          contrato_url?: string | null
          coste_seg_social?: number | null
          coste_total_anual?: number | null
          coste_total_mensual?: number | null
          created_at?: string | null
          departamento?: string | null
          email?: string | null
          fecha_alta?: string | null
          fecha_baja?: string | null
          firma_url?: string | null
          id?: string
          nif?: string | null
          nombre?: string
          notas?: string | null
          oficina?: string | null
          puesto?: string | null
          rol?: string | null
          salario_base?: number | null
          tipo_contrato?: string | null
          variable?: number | null
        }
        Relationships: []
      }
      entrevistas: {
        Row: {
          candidato_id: string
          created_at: string | null
          created_by: string | null
          debilidades: string[] | null
          duracion_minutos: number | null
          entrevistador_id: string
          estado: string | null
          fecha_hora: string
          fortalezas: string[] | null
          id: string
          meeting_url: string | null
          notas_evaluacion: string | null
          puntuacion: number | null
          recomendacion: string | null
          ronda: number | null
          tipo: string | null
          ubicacion: string | null
          updated_at: string | null
        }
        Insert: {
          candidato_id: string
          created_at?: string | null
          created_by?: string | null
          debilidades?: string[] | null
          duracion_minutos?: number | null
          entrevistador_id: string
          estado?: string | null
          fecha_hora: string
          fortalezas?: string[] | null
          id?: string
          meeting_url?: string | null
          notas_evaluacion?: string | null
          puntuacion?: number | null
          recomendacion?: string | null
          ronda?: number | null
          tipo?: string | null
          ubicacion?: string | null
          updated_at?: string | null
        }
        Update: {
          candidato_id?: string
          created_at?: string | null
          created_by?: string | null
          debilidades?: string[] | null
          duracion_minutos?: number | null
          entrevistador_id?: string
          estado?: string | null
          fecha_hora?: string
          fortalezas?: string[] | null
          id?: string
          meeting_url?: string | null
          notas_evaluacion?: string | null
          puntuacion?: number | null
          recomendacion?: string | null
          ronda?: number | null
          tipo?: string | null
          ubicacion?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entrevistas_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entrevistas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entrevistas_entrevistador_id_fkey"
            columns: ["entrevistador_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_positions: {
        Row: {
          contract_type: string
          created_at: string | null
          created_by: string | null
          department: string
          description: string
          description_ca: string | null
          description_en: string | null
          description_es: string | null
          display_order: number | null
          id: string
          is_featured: boolean | null
          location: string
          published_at: string | null
          requirements: string[]
          requirements_ca: string[] | null
          requirements_en: string[] | null
          requirements_es: string[] | null
          responsibilities: string[]
          responsibilities_ca: string[] | null
          responsibilities_en: string[] | null
          responsibilities_es: string[] | null
          salary_range: string | null
          slug: string
          slug_ca: string | null
          slug_en: string | null
          slug_es: string | null
          status: Database["public"]["Enums"]["job_status"]
          title: string
          title_ca: string | null
          title_en: string | null
          title_es: string | null
          updated_at: string | null
          updated_by: string | null
          working_hours: string
        }
        Insert: {
          contract_type: string
          created_at?: string | null
          created_by?: string | null
          department: string
          description: string
          description_ca?: string | null
          description_en?: string | null
          description_es?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          location: string
          published_at?: string | null
          requirements?: string[]
          requirements_ca?: string[] | null
          requirements_en?: string[] | null
          requirements_es?: string[] | null
          responsibilities?: string[]
          responsibilities_ca?: string[] | null
          responsibilities_en?: string[] | null
          responsibilities_es?: string[] | null
          salary_range?: string | null
          slug: string
          slug_ca?: string | null
          slug_en?: string | null
          slug_es?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          title_ca?: string | null
          title_en?: string | null
          title_es?: string | null
          updated_at?: string | null
          updated_by?: string | null
          working_hours: string
        }
        Update: {
          contract_type?: string
          created_at?: string | null
          created_by?: string | null
          department?: string
          description?: string
          description_ca?: string | null
          description_en?: string | null
          description_es?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          location?: string
          published_at?: string | null
          requirements?: string[]
          requirements_ca?: string[] | null
          requirements_en?: string[] | null
          requirements_es?: string[] | null
          responsibilities?: string[]
          responsibilities_ca?: string[] | null
          responsibilities_en?: string[] | null
          responsibilities_es?: string[] | null
          salary_range?: string | null
          slug?: string
          slug_ca?: string | null
          slug_en?: string | null
          slug_es?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          title_ca?: string | null
          title_en?: string | null
          title_es?: string | null
          updated_at?: string | null
          updated_by?: string | null
          working_hours?: string
        }
        Relationships: []
      }
      media_files: {
        Row: {
          alt_text: string | null
          card_path: string | null
          card_url: string | null
          created_at: string | null
          description: string | null
          file_name: string
          file_size: number
          file_type: string
          height: number | null
          hero_path: string | null
          hero_url: string | null
          id: string
          last_used_at: string | null
          mime_type: string
          original_name: string
          original_path: string
          original_url: string
          tags: string[] | null
          thumbnail_path: string | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          uploaded_at: string | null
          uploaded_by: string
          usage_count: number | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          card_path?: string | null
          card_url?: string | null
          created_at?: string | null
          description?: string | null
          file_name: string
          file_size: number
          file_type: string
          height?: number | null
          hero_path?: string | null
          hero_url?: string | null
          id?: string
          last_used_at?: string | null
          mime_type: string
          original_name: string
          original_path: string
          original_url: string
          tags?: string[] | null
          thumbnail_path?: string | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          uploaded_by: string
          usage_count?: number | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          card_path?: string | null
          card_url?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          height?: number | null
          hero_path?: string | null
          hero_url?: string | null
          id?: string
          last_used_at?: string | null
          mime_type?: string
          original_name?: string
          original_path?: string
          original_url?: string
          tags?: string[] | null
          thumbnail_path?: string | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          uploaded_by?: string
          usage_count?: number | null
          width?: number | null
        }
        Relationships: []
      }
      media_usage: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          media_file_id: string
          usage_type: string
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          media_file_id: string
          usage_type: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          media_file_id?: string
          usage_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_usage_media_file_id_fkey"
            columns: ["media_file_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      movimientos_mes: {
        Row: {
          aprobado: boolean | null
          cierre_id: string
          created_at: string | null
          descripcion: string | null
          empleado_id: string
          fecha_efectiva: string | null
          fecha_revision: string | null
          id: string
          importe_impacto: number | null
          revisado: boolean | null
          revisado_por: string | null
          tipo: string
          valor_anterior: number | null
          valor_nuevo: number | null
        }
        Insert: {
          aprobado?: boolean | null
          cierre_id: string
          created_at?: string | null
          descripcion?: string | null
          empleado_id: string
          fecha_efectiva?: string | null
          fecha_revision?: string | null
          id?: string
          importe_impacto?: number | null
          revisado?: boolean | null
          revisado_por?: string | null
          tipo: string
          valor_anterior?: number | null
          valor_nuevo?: number | null
        }
        Update: {
          aprobado?: boolean | null
          cierre_id?: string
          created_at?: string | null
          descripcion?: string | null
          empleado_id?: string
          fecha_efectiva?: string | null
          fecha_revision?: string | null
          id?: string
          importe_impacto?: number | null
          revisado?: boolean | null
          revisado_por?: string | null
          tipo?: string
          valor_anterior?: number | null
          valor_nuevo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "movimientos_mes_cierre_id_fkey"
            columns: ["cierre_id"]
            isOneToOne: false
            referencedRelation: "cierres_nomina"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_mes_empleado_id_fkey"
            columns: ["empleado_id"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_mes_revisado_por_fkey"
            columns: ["revisado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          author_avatar_url: string | null
          author_name: string | null
          category: string
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          read_time: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_avatar_url?: string | null
          author_name?: string | null
          category: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string | null
          category?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      nominas: {
        Row: {
          anio: number | null
          bruto: number | null
          coste_empresa: number | null
          empleado_id: string | null
          fecha_subida: string | null
          id: string
          mes: number | null
          neto: number | null
          pdf_url: string | null
        }
        Insert: {
          anio?: number | null
          bruto?: number | null
          coste_empresa?: number | null
          empleado_id?: string | null
          fecha_subida?: string | null
          id?: string
          mes?: number | null
          neto?: number | null
          pdf_url?: string | null
        }
        Update: {
          anio?: number | null
          bruto?: number | null
          coste_empresa?: number | null
          empleado_id?: string | null
          fecha_subida?: string | null
          id?: string
          mes?: number | null
          neto?: number | null
          pdf_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nominas_empleado_id_fkey"
            columns: ["empleado_id"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          category: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          expires_at: string | null
          id: string
          message: string
          read: boolean | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          category?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          expires_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          category?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          expires_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      page_content: {
        Row: {
          content: Json
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          page_key: string
          section_key: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          page_key: string
          section_key: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          page_key?: string
          section_key?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      portfolio_companies: {
        Row: {
          country: string
          created_at: string | null
          description: string | null
          display_order: number | null
          founded_year: number | null
          id: string
          investment_date: string | null
          investment_thesis: string | null
          is_active: boolean | null
          is_featured: boolean | null
          logo_url: string | null
          metrics: Json | null
          name: string
          sector: string
          slug: string
          stage: string
          timeline: Json | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          founded_year?: number | null
          id?: string
          investment_date?: string | null
          investment_thesis?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          logo_url?: string | null
          metrics?: Json | null
          name: string
          sector: string
          slug: string
          stage: string
          timeline?: Json | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          founded_year?: number | null
          id?: string
          investment_date?: string | null
          investment_thesis?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          logo_url?: string | null
          metrics?: Json | null
          name?: string
          sector?: string
          slug?: string
          stage?: string
          timeline?: Json | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      presupuestos: {
        Row: {
          anio: number
          created_at: string | null
          departamento: string
          id: string
          importe_anual: number
        }
        Insert: {
          anio: number
          created_at?: string | null
          departamento: string
          id?: string
          importe_anual?: number
        }
        Update: {
          anio?: number
          created_at?: string | null
          departamento?: string
          id?: string
          importe_anual?: number
        }
        Relationships: []
      }
      previsiones_nomina: {
        Row: {
          bonus_previsto: number | null
          bruto_previsto: number | null
          cierre_id: string
          confirmado: boolean | null
          coste_ss_previsto: number | null
          coste_total_previsto: number | null
          created_at: string | null
          empleado_id: string
          id: string
          notas: string | null
          updated_at: string | null
          variable_previsto: number | null
        }
        Insert: {
          bonus_previsto?: number | null
          bruto_previsto?: number | null
          cierre_id: string
          confirmado?: boolean | null
          coste_ss_previsto?: number | null
          coste_total_previsto?: number | null
          created_at?: string | null
          empleado_id: string
          id?: string
          notas?: string | null
          updated_at?: string | null
          variable_previsto?: number | null
        }
        Update: {
          bonus_previsto?: number | null
          bruto_previsto?: number | null
          cierre_id?: string
          confirmado?: boolean | null
          coste_ss_previsto?: number | null
          coste_total_previsto?: number | null
          created_at?: string | null
          empleado_id?: string
          id?: string
          notas?: string | null
          updated_at?: string | null
          variable_previsto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "previsiones_nomina_cierre_id_fkey"
            columns: ["cierre_id"]
            isOneToOne: false
            referencedRelation: "cierres_nomina"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "previsiones_nomina_empleado_id_fkey"
            columns: ["empleado_id"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      rate_limit_tracking: {
        Row: {
          category: string
          created_at: string | null
          id: string
          identifier: string
          last_request: string | null
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          identifier: string
          last_request?: string | null
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          identifier?: string
          last_request?: string | null
          request_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: Database["public"]["Enums"]["security_event_type"]
          id: string
          ip_address: string | null
          operation: string | null
          severity: Database["public"]["Enums"]["event_severity"]
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: Database["public"]["Enums"]["security_event_type"]
          id?: string
          ip_address?: string | null
          operation?: string | null
          severity?: Database["public"]["Enums"]["event_severity"]
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: Database["public"]["Enums"]["security_event_type"]
          id?: string
          ip_address?: string | null
          operation?: string | null
          severity?: Database["public"]["Enums"]["event_severity"]
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          area: string
          benefits: string | null
          benefits_ca: string | null
          benefits_en: string | null
          benefits_es: string | null
          created_at: string | null
          created_by: string | null
          description: string
          description_ca: string | null
          description_en: string | null
          description_es: string | null
          display_order: number | null
          features: string[]
          features_ca: string[] | null
          features_en: string[] | null
          features_es: string[] | null
          icon_name: string
          id: string
          is_active: boolean | null
          meta_description: string | null
          meta_description_ca: string | null
          meta_description_en: string | null
          meta_description_es: string | null
          meta_title: string | null
          meta_title_ca: string | null
          meta_title_en: string | null
          meta_title_es: string | null
          metodologia: Json | null
          name: string
          name_ca: string | null
          name_en: string | null
          name_es: string | null
          servicios_transversales: Json | null
          slug: string
          slug_ca: string | null
          slug_en: string | null
          slug_es: string | null
          stats: Json | null
          typical_clients: string[]
          typical_clients_ca: string[] | null
          typical_clients_en: string[] | null
          typical_clients_es: string[] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          area: string
          benefits?: string | null
          benefits_ca?: string | null
          benefits_en?: string | null
          benefits_es?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          description_ca?: string | null
          description_en?: string | null
          description_es?: string | null
          display_order?: number | null
          features?: string[]
          features_ca?: string[] | null
          features_en?: string[] | null
          features_es?: string[] | null
          icon_name: string
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_description_ca?: string | null
          meta_description_en?: string | null
          meta_description_es?: string | null
          meta_title?: string | null
          meta_title_ca?: string | null
          meta_title_en?: string | null
          meta_title_es?: string | null
          metodologia?: Json | null
          name: string
          name_ca?: string | null
          name_en?: string | null
          name_es?: string | null
          servicios_transversales?: Json | null
          slug: string
          slug_ca?: string | null
          slug_en?: string | null
          slug_es?: string | null
          stats?: Json | null
          typical_clients?: string[]
          typical_clients_ca?: string[] | null
          typical_clients_en?: string[] | null
          typical_clients_es?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          area?: string
          benefits?: string | null
          benefits_ca?: string | null
          benefits_en?: string | null
          benefits_es?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          description_ca?: string | null
          description_en?: string | null
          description_es?: string | null
          display_order?: number | null
          features?: string[]
          features_ca?: string[] | null
          features_en?: string[] | null
          features_es?: string[] | null
          icon_name?: string
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_description_ca?: string | null
          meta_description_en?: string | null
          meta_description_es?: string | null
          meta_title?: string | null
          meta_title_ca?: string | null
          meta_title_en?: string | null
          meta_title_es?: string | null
          metodologia?: Json | null
          name?: string
          name_ca?: string | null
          name_en?: string | null
          name_es?: string | null
          servicios_transversales?: Json | null
          slug?: string
          slug_ca?: string | null
          slug_en?: string | null
          slug_es?: string | null
          stats?: Json | null
          typical_clients?: string[]
          typical_clients_ca?: string[] | null
          typical_clients_en?: string[] | null
          typical_clients_es?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      simulaciones: {
        Row: {
          descripcion: string | null
          detalles: Json | null
          fecha: string | null
          id: string
          resultado_total: number | null
          subida_fija: number | null
          subida_porcentaje: number | null
          usuario: string | null
        }
        Insert: {
          descripcion?: string | null
          detalles?: Json | null
          fecha?: string | null
          id?: string
          resultado_total?: number | null
          subida_fija?: number | null
          subida_porcentaje?: number | null
          usuario?: string | null
        }
        Update: {
          descripcion?: string | null
          detalles?: Json | null
          fecha?: string | null
          id?: string
          resultado_total?: number | null
          subida_fija?: number | null
          subida_porcentaje?: number | null
          usuario?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          avatar_url: string | null
          bio: string | null
          bio_ca: string | null
          bio_en: string | null
          bio_es: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          linkedin: string | null
          name: string
          order_index: number | null
          position: string | null
          position_ca: string | null
          position_en: string | null
          position_es: string | null
          specialization: string | null
          specialization_ca: string | null
          specialization_en: string | null
          specialization_es: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          bio_ca?: string | null
          bio_en?: string | null
          bio_es?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          linkedin?: string | null
          name: string
          order_index?: number | null
          position?: string | null
          position_ca?: string | null
          position_en?: string | null
          position_es?: string | null
          specialization?: string | null
          specialization_ca?: string | null
          specialization_en?: string | null
          specialization_es?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          bio_ca?: string | null
          bio_en?: string | null
          bio_es?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          linkedin?: string | null
          name?: string
          order_index?: number | null
          position?: string | null
          position_ca?: string | null
          position_en?: string | null
          position_es?: string | null
          specialization?: string | null
          specialization_ca?: string | null
          specialization_en?: string | null
          specialization_es?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      nominas_summary: {
        Row: {
          anio: number | null
          bruto: number | null
          coste_empresa: number | null
          empleado_id: string | null
          fecha_subida: string | null
          id: string | null
          mes: number | null
          neto: number | null
        }
        Insert: {
          anio?: number | null
          bruto?: number | null
          coste_empresa?: number | null
          empleado_id?: string | null
          fecha_subida?: string | null
          id?: string | null
          mes?: number | null
          neto?: number | null
        }
        Update: {
          anio?: number | null
          bruto?: number | null
          coste_empresa?: number | null
          empleado_id?: string | null
          fecha_subida?: string | null
          id?: string | null
          mes?: number | null
          neto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nominas_empleado_id_fkey"
            columns: ["empleado_id"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_login_rate_limit: {
        Args: {
          p_identifier: string
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      check_rate_limit_enhanced_safe: {
        Args: {
          p_category: string
          p_identifier: string
          p_max_requests?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      cleanup_old_security_events: { Args: never; Returns: undefined }
      count_blog_posts: {
        Args: {
          filter_category?: string
          filter_status?: string
          filter_tags?: string[]
          search_query?: string
        }
        Returns: number
      }
      get_blog_filter_options: {
        Args: never
        Returns: {
          all_tags: string[]
          categories: string[]
        }[]
      }
      get_blog_stats: {
        Args: never
        Returns: {
          total_drafts: number
          total_published: number
          total_scheduled: number
          total_views: number
        }[]
      }
      get_case_studies_filter_options: {
        Args: never
        Returns: {
          all_tags: string[]
          industries: string[]
          services: string[]
        }[]
      }
      get_news_filter_options: {
        Args: never
        Returns: {
          all_tags: string[]
          categories: string[]
        }[]
      }
      get_portfolio_filter_options: {
        Args: never
        Returns: {
          countries: string[]
          sectors: string[]
          stages: string[]
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_blog_view_count: {
        Args: { post_id: string }
        Returns: undefined
      }
      increment_case_study_view_count: {
        Args: { case_study_id: string }
        Returns: undefined
      }
      publish_scheduled_posts: { Args: never; Returns: number }
      run_maintenance_tasks: { Args: never; Returns: undefined }
      search_blog_posts: {
        Args: {
          filter_category?: string
          filter_status?: string
          filter_tags?: string[]
          lang?: string
          limit_count?: number
          offset_count?: number
          search_query?: string
        }
        Returns: {
          author_name: string
          author_specialization: string
          category: string
          excerpt_es: string
          featured_image: string
          id: string
          published_at: string
          read_time: number
          relevance: number
          slug_es: string
          status: string
          tags: string[]
          title_es: string
          view_count: number
        }[]
      }
      search_case_studies: {
        Args: {
          filter_industry?: string
          filter_service?: string
          filter_status?: Database["public"]["Enums"]["case_study_status"]
          filter_tags?: string[]
          limit_count?: number
          offset_count?: number
          search_query?: string
        }
        Returns: {
          client_industry: string
          client_logo_url: string
          client_name: string
          hero_image_url: string
          hero_subtitle: string
          id: string
          is_featured: boolean
          metrics: Json
          primary_service: string
          published_at: string
          relevance: number
          results_summary: string
          slug: string
          status: Database["public"]["Enums"]["case_study_status"]
          tags: string[]
          title: string
          view_count: number
        }[]
      }
      search_news_articles: {
        Args: {
          filter_category?: string
          filter_tags?: string[]
          limit_count?: number
          offset_count?: number
          search_query?: string
        }
        Returns: {
          author_avatar_url: string
          author_name: string
          category: string
          content: string
          created_at: string
          excerpt: string
          featured_image_url: string
          id: string
          is_featured: boolean
          is_published: boolean
          published_at: string
          read_time: number
          relevance: number
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }[]
      }
      search_portfolio_companies: {
        Args: {
          filter_country?: string
          filter_sector?: string
          filter_stage?: string
          limit_count?: number
          offset_count?: number
          search_query?: string
        }
        Returns: {
          country: string
          created_at: string | null
          description: string | null
          display_order: number | null
          founded_year: number | null
          id: string
          investment_date: string | null
          investment_thesis: string | null
          is_active: boolean | null
          is_featured: boolean | null
          logo_url: string | null
          metrics: Json | null
          name: string
          sector: string
          slug: string
          stage: string
          timeline: Json | null
          updated_at: string | null
          website_url: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "portfolio_companies"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "marketing"
        | "editor"
        | "viewer"
        | "hr_manager"
        | "hr_viewer"
      case_study_status: "draft" | "review" | "published" | "archived"
      event_severity: "info" | "warn" | "high" | "critical"
      job_status: "draft" | "published" | "closed"
      security_event_type:
        | "LOGIN_SUCCESS"
        | "LOGIN_FAILED"
        | "LOGOUT"
        | "RATE_LIMIT_EXCEEDED"
        | "UNAUTHORIZED_ACCESS"
        | "ADMIN_ACTION"
        | "DEMO_REQUEST_SUBMISSION"
        | "CONTACT_FORM_SUBMISSION"
        | "PASSWORD_RESET"
        | "SESSION_EXPIRED"
      service_type:
        | "empresa_familiar"
        | "tax_advisory"
        | "legal_advisory"
        | "financial_planning"
        | "other"
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
    Enums: {
      app_role: [
        "admin",
        "marketing",
        "editor",
        "viewer",
        "hr_manager",
        "hr_viewer",
      ],
      case_study_status: ["draft", "review", "published", "archived"],
      event_severity: ["info", "warn", "high", "critical"],
      job_status: ["draft", "published", "closed"],
      security_event_type: [
        "LOGIN_SUCCESS",
        "LOGIN_FAILED",
        "LOGOUT",
        "RATE_LIMIT_EXCEEDED",
        "UNAUTHORIZED_ACCESS",
        "ADMIN_ACTION",
        "DEMO_REQUEST_SUBMISSION",
        "CONTACT_FORM_SUBMISSION",
        "PASSWORD_RESET",
        "SESSION_EXPIRED",
      ],
      service_type: [
        "empresa_familiar",
        "tax_advisory",
        "legal_advisory",
        "financial_planning",
        "other",
      ],
    },
  },
} as const
