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
      awards: {
        Row: {
          category: string
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          organization: string
          short_name: string
          source_site: string | null
          updated_at: string | null
          year: string
        }
        Insert: {
          category: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          organization: string
          short_name: string
          source_site?: string | null
          updated_at?: string | null
          year: string
        }
        Update: {
          category?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization?: string
          short_name?: string
          source_site?: string | null
          updated_at?: string | null
          year?: string
        }
        Relationships: []
      }
      blog_automation_settings: {
        Row: {
          articles_per_run: number
          auto_publish: boolean
          created_at: string
          default_language: string
          default_tone: string
          id: string
          is_enabled: boolean
          last_run_at: string | null
          next_run_at: string | null
          notify_on_generation: boolean
          run_interval_days: number
          updated_at: string
        }
        Insert: {
          articles_per_run?: number
          auto_publish?: boolean
          created_at?: string
          default_language?: string
          default_tone?: string
          id?: string
          is_enabled?: boolean
          last_run_at?: string | null
          next_run_at?: string | null
          notify_on_generation?: boolean
          run_interval_days?: number
          updated_at?: string
        }
        Update: {
          articles_per_run?: number
          auto_publish?: boolean
          created_at?: string
          default_language?: string
          default_tone?: string
          id?: string
          is_enabled?: boolean
          last_run_at?: string | null
          next_run_at?: string | null
          notify_on_generation?: boolean
          run_interval_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      blog_generation_queue: {
        Row: {
          category: string
          created_at: string
          error_message: string | null
          generated_post_id: string | null
          id: string
          language: string
          scheduled_for: string
          status: string
          tone: string
          topic: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          error_message?: string | null
          generated_post_id?: string | null
          id?: string
          language?: string
          scheduled_for?: string
          status?: string
          tone?: string
          topic: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          error_message?: string | null
          generated_post_id?: string | null
          id?: string
          language?: string
          scheduled_for?: string
          status?: string
          tone?: string
          topic?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_generation_queue_generated_post_id_fkey"
            columns: ["generated_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
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
          passed_validation: boolean | null
          published_at: string | null
          quality_checks: Json | null
          quality_score: number | null
          read_time: number | null
          scheduled_at: string | null
          seo_description_en: string | null
          seo_description_es: string | null
          seo_title_en: string | null
          seo_title_es: string | null
          shared_sites: string[] | null
          slug_en: string | null
          slug_es: string
          source_site: Database["public"]["Enums"]["site_source"] | null
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
          passed_validation?: boolean | null
          published_at?: string | null
          quality_checks?: Json | null
          quality_score?: number | null
          read_time?: number | null
          scheduled_at?: string | null
          seo_description_en?: string | null
          seo_description_es?: string | null
          seo_title_en?: string | null
          seo_title_es?: string | null
          shared_sites?: string[] | null
          slug_en?: string | null
          slug_es: string
          source_site?: Database["public"]["Enums"]["site_source"] | null
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
          passed_validation?: boolean | null
          published_at?: string | null
          quality_checks?: Json | null
          quality_score?: number | null
          read_time?: number | null
          scheduled_at?: string | null
          seo_description_en?: string | null
          seo_description_es?: string | null
          seo_title_en?: string | null
          seo_title_es?: string | null
          shared_sites?: string[] | null
          slug_en?: string | null
          slug_es?: string
          source_site?: Database["public"]["Enums"]["site_source"] | null
          status?: string
          tags?: string[] | null
          title_en?: string | null
          title_es?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      blog_topics_queue: {
        Row: {
          category: string | null
          created_at: string | null
          error_message: string | null
          generated_post_id: string | null
          id: string
          priority: number | null
          processed_at: string | null
          scheduled_for: string | null
          status: string | null
          target_keywords: string[] | null
          target_language: string | null
          target_site: string | null
          topic: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          error_message?: string | null
          generated_post_id?: string | null
          id?: string
          priority?: number | null
          processed_at?: string | null
          scheduled_for?: string | null
          status?: string | null
          target_keywords?: string[] | null
          target_language?: string | null
          target_site?: string | null
          topic: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          error_message?: string | null
          generated_post_id?: string | null
          id?: string
          priority?: number | null
          processed_at?: string | null
          scheduled_for?: string | null
          status?: string | null
          target_keywords?: string[] | null
          target_language?: string | null
          target_site?: string | null
          topic?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_topics_queue_generated_post_id_fkey"
            columns: ["generated_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_kits: {
        Row: {
          cover_bg_url: string | null
          created_at: string | null
          font_urls: Json | null
          id: string
          is_default: boolean | null
          logo_url: string | null
          name: string
          tokens_json: Json
          updated_at: string | null
        }
        Insert: {
          cover_bg_url?: string | null
          created_at?: string | null
          font_urls?: Json | null
          id?: string
          is_default?: boolean | null
          logo_url?: string | null
          name?: string
          tokens_json?: Json
          updated_at?: string | null
        }
        Update: {
          cover_bg_url?: string | null
          created_at?: string | null
          font_urls?: Json | null
          id?: string
          is_default?: boolean | null
          logo_url?: string | null
          name?: string
          tokens_json?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      calculator_settings: {
        Row: {
          category: string
          conditions: Json | null
          created_at: string | null
          display_order: number | null
          entity_type: string | null
          id: string
          is_active: boolean | null
          item_key: string
          item_label: string
          item_notes: string | null
          max_value: number
          min_value: number
          updated_at: string | null
        }
        Insert: {
          category: string
          conditions?: Json | null
          created_at?: string | null
          display_order?: number | null
          entity_type?: string | null
          id?: string
          is_active?: boolean | null
          item_key: string
          item_label: string
          item_notes?: string | null
          max_value?: number
          min_value?: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          conditions?: Json | null
          created_at?: string | null
          display_order?: number | null
          entity_type?: string | null
          id?: string
          is_active?: boolean | null
          item_key?: string
          item_label?: string
          item_notes?: string | null
          max_value?: number
          min_value?: number
          updated_at?: string | null
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
          source_site: Database["public"]["Enums"]["site_source"] | null
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
          source_site?: Database["public"]["Enums"]["site_source"] | null
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
          source_site?: Database["public"]["Enums"]["site_source"] | null
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
          source_site: Database["public"]["Enums"]["site_source"] | null
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
          source_site?: Database["public"]["Enums"]["site_source"] | null
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
          source_site?: Database["public"]["Enums"]["site_source"] | null
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
      company_setup_leads: {
        Row: {
          assigned_to: string | null
          calculator_data: Json | null
          company_name: string | null
          company_stage: string | null
          consultation_date: string | null
          contacted_at: string | null
          conversion_type: string | null
          country_origin: string
          created_at: string | null
          email: string
          estimated_revenue: string | null
          id: string
          industry: string | null
          ip_address: string | null
          landing_page_url: string | null
          landing_variant: string
          lead_score: number | null
          message: string | null
          name: string
          notes: string | null
          phone: string | null
          priority: string | null
          referrer: string | null
          source_site: Database["public"]["Enums"]["site_source"] | null
          status: string | null
          timeline: string | null
          updated_at: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          assigned_to?: string | null
          calculator_data?: Json | null
          company_name?: string | null
          company_stage?: string | null
          consultation_date?: string | null
          contacted_at?: string | null
          conversion_type?: string | null
          country_origin: string
          created_at?: string | null
          email: string
          estimated_revenue?: string | null
          id?: string
          industry?: string | null
          ip_address?: string | null
          landing_page_url?: string | null
          landing_variant: string
          lead_score?: number | null
          message?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          referrer?: string | null
          source_site?: Database["public"]["Enums"]["site_source"] | null
          status?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          assigned_to?: string | null
          calculator_data?: Json | null
          company_name?: string | null
          company_stage?: string | null
          consultation_date?: string | null
          contacted_at?: string | null
          conversion_type?: string | null
          country_origin?: string
          created_at?: string | null
          email?: string
          estimated_revenue?: string | null
          id?: string
          industry?: string | null
          ip_address?: string | null
          landing_page_url?: string | null
          landing_variant?: string
          lead_score?: number | null
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          referrer?: string | null
          source_site?: Database["public"]["Enums"]["site_source"] | null
          status?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
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
          lead_source: string | null
          message: string
          name: string
          phone: string | null
          responded_at: string | null
          responded_by: string | null
          response_notes: string | null
          service_type: Database["public"]["Enums"]["service_type"] | null
          source_site: Database["public"]["Enums"]["site_source"] | null
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
          lead_source?: string | null
          message: string
          name: string
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          response_notes?: string | null
          service_type?: Database["public"]["Enums"]["service_type"] | null
          source_site?: Database["public"]["Enums"]["site_source"] | null
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
          lead_source?: string | null
          message?: string
          name?: string
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          response_notes?: string | null
          service_type?: Database["public"]["Enums"]["service_type"] | null
          source_site?: Database["public"]["Enums"]["site_source"] | null
          subject?: string
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          created_at: string | null
          id: string
          language: string | null
          markdown: string
          metadata: Json | null
          section: string
          source_url: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          language?: string | null
          markdown: string
          metadata?: Json | null
          section: string
          source_url?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          language?: string | null
          markdown?: string
          metadata?: Json | null
          section?: string
          source_url?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      corporate_presentations: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          download_count: number | null
          file_url: string
          format: string
          id: string
          is_active: boolean | null
          language: string | null
          page_count: number | null
          tags: string[] | null
          target_audience: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          file_url: string
          format?: string
          id?: string
          is_active?: boolean | null
          language?: string | null
          page_count?: number | null
          tags?: string[] | null
          target_audience?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          file_url?: string
          format?: string
          id?: string
          is_active?: boolean | null
          language?: string | null
          page_count?: number | null
          tags?: string[] | null
          target_audience?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      deck_slides: {
        Row: {
          content_json: Json
          created_at: string | null
          deck_id: string
          id: string
          slide_order: number
          slide_type: string
          speaker_notes: string | null
          title: string | null
        }
        Insert: {
          content_json?: Json
          created_at?: string | null
          deck_id: string
          id?: string
          slide_order: number
          slide_type: string
          speaker_notes?: string | null
          title?: string | null
        }
        Update: {
          content_json?: Json
          created_at?: string | null
          deck_id?: string
          id?: string
          slide_order?: number
          slide_type?: string
          speaker_notes?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deck_slides_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
        ]
      }
      decks: {
        Row: {
          audience: string | null
          brand_kit_id: string | null
          created_at: string | null
          created_by: string | null
          goal: string | null
          id: string
          language: string | null
          name: string
          outline_json: Json | null
          pdf_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          audience?: string | null
          brand_kit_id?: string | null
          created_at?: string | null
          created_by?: string | null
          goal?: string | null
          id?: string
          language?: string | null
          name: string
          outline_json?: Json | null
          pdf_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          audience?: string | null
          brand_kit_id?: string | null
          created_at?: string | null
          created_by?: string | null
          goal?: string | null
          id?: string
          language?: string | null
          name?: string
          outline_json?: Json | null
          pdf_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "decks_brand_kit_id_fkey"
            columns: ["brand_kit_id"]
            isOneToOne: false
            referencedRelation: "brand_kits"
            referencedColumns: ["id"]
          },
        ]
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
          source_site: Database["public"]["Enums"]["site_source"] | null
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
          source_site?: Database["public"]["Enums"]["site_source"] | null
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
          source_site?: Database["public"]["Enums"]["site_source"] | null
          status?: string | null
        }
        Relationships: []
      }
      editorial_calendar_events: {
        Row: {
          created_at: string | null
          days_before_publish: number | null
          event_date: string
          event_name: string
          id: string
          is_active: boolean | null
          recurrence: string | null
          suggested_category: string | null
          suggested_topic_template: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          days_before_publish?: number | null
          event_date: string
          event_name: string
          id?: string
          is_active?: boolean | null
          recurrence?: string | null
          suggested_category?: string | null
          suggested_topic_template?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          days_before_publish?: number | null
          event_date?: string
          event_name?: string
          id?: string
          is_active?: boolean | null
          recurrence?: string | null
          suggested_category?: string | null
          suggested_topic_template?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      email_nurture_sequences: {
        Row: {
          created_at: string | null
          delay_days: number
          html_content: string
          id: string
          is_active: boolean | null
          lead_type: string
          sequence_order: number
          subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delay_days?: number
          html_content: string
          id?: string
          is_active?: boolean | null
          lead_type: string
          sequence_order?: number
          subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delay_days?: number
          html_content?: string
          id?: string
          is_active?: boolean | null
          lead_type?: string
          sequence_order?: number
          subject?: string
          updated_at?: string | null
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
      generated_presentations: {
        Row: {
          audience_type: string | null
          case_studies_included: Json | null
          client_company: string | null
          client_logo_url: string | null
          client_name: string
          cover_tagline: string | null
          created_at: string
          cta_type: string | null
          custom_intro: string | null
          differentiators: Json | null
          format: string
          generated_by: string | null
          html_content: string | null
          id: string
          include_methodology: boolean | null
          include_stats: boolean | null
          include_toc: boolean | null
          include_value_proposition: boolean | null
          language: string
          narrative_score: number | null
          pdf_url: string | null
          presentation_objective: string | null
          presentation_type: string | null
          quality_mode: string | null
          sector: string | null
          services_included: Json | null
          show_case_metrics: boolean | null
          show_service_features: boolean | null
          show_team_bio: boolean | null
          show_testimonials: boolean | null
          status: string
          team_members_included: Json | null
          updated_at: string
          validation_passed: boolean | null
        }
        Insert: {
          audience_type?: string | null
          case_studies_included?: Json | null
          client_company?: string | null
          client_logo_url?: string | null
          client_name: string
          cover_tagline?: string | null
          created_at?: string
          cta_type?: string | null
          custom_intro?: string | null
          differentiators?: Json | null
          format?: string
          generated_by?: string | null
          html_content?: string | null
          id?: string
          include_methodology?: boolean | null
          include_stats?: boolean | null
          include_toc?: boolean | null
          include_value_proposition?: boolean | null
          language?: string
          narrative_score?: number | null
          pdf_url?: string | null
          presentation_objective?: string | null
          presentation_type?: string | null
          quality_mode?: string | null
          sector?: string | null
          services_included?: Json | null
          show_case_metrics?: boolean | null
          show_service_features?: boolean | null
          show_team_bio?: boolean | null
          show_testimonials?: boolean | null
          status?: string
          team_members_included?: Json | null
          updated_at?: string
          validation_passed?: boolean | null
        }
        Update: {
          audience_type?: string | null
          case_studies_included?: Json | null
          client_company?: string | null
          client_logo_url?: string | null
          client_name?: string
          cover_tagline?: string | null
          created_at?: string
          cta_type?: string | null
          custom_intro?: string | null
          differentiators?: Json | null
          format?: string
          generated_by?: string | null
          html_content?: string | null
          id?: string
          include_methodology?: boolean | null
          include_stats?: boolean | null
          include_toc?: boolean | null
          include_value_proposition?: boolean | null
          language?: string
          narrative_score?: number | null
          pdf_url?: string | null
          presentation_objective?: string | null
          presentation_type?: string | null
          quality_mode?: string | null
          sector?: string | null
          services_included?: Json | null
          show_case_metrics?: boolean | null
          show_service_features?: boolean | null
          show_team_bio?: boolean | null
          show_testimonials?: boolean | null
          status?: string
          team_members_included?: Json | null
          updated_at?: string
          validation_passed?: boolean | null
        }
        Relationships: []
      }
      internal_tools: {
        Row: {
          category: string | null
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          login_url: string
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          login_url: string
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          login_url?: string
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
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
          source_site: Database["public"]["Enums"]["site_source"] | null
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
          source_site?: Database["public"]["Enums"]["site_source"] | null
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
          source_site?: Database["public"]["Enums"]["site_source"] | null
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
      knowledge_articles: {
        Row: {
          category: string
          content: string
          created_at: string | null
          created_by: string | null
          featured: boolean | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string | null
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          created_by?: string | null
          featured?: boolean | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          featured?: boolean | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      landing_pages: {
        Row: {
          ads_campaigns: string | null
          category: string | null
          conversion_count: number | null
          created_at: string | null
          created_by: string | null
          custom_navbar: string | null
          featured_image: string | null
          health_score: number | null
          id: string
          is_active: boolean | null
          keywords: string[] | null
          layout_type: string | null
          meta_description: string | null
          meta_description_ca: string | null
          meta_description_en: string | null
          meta_description_es: string | null
          meta_title: string | null
          meta_title_ca: string | null
          meta_title_en: string | null
          meta_title_es: string | null
          notes: string | null
          primary_cta_text: string | null
          primary_cta_text_ca: string | null
          primary_cta_text_en: string | null
          primary_cta_text_es: string | null
          primary_cta_url: string | null
          primary_cta_variant: string | null
          qr_code: string | null
          secondary_cta_text: string | null
          secondary_cta_url: string | null
          sections: Json
          slug: string
          slug_ca: string | null
          slug_en: string | null
          slug_es: string | null
          source_site: Database["public"]["Enums"]["site_source"] | null
          status: string | null
          title: string
          title_ca: string | null
          title_en: string | null
          title_es: string | null
          updated_at: string | null
          updated_by: string | null
          url: string | null
          use_footer: boolean | null
          use_navbar: boolean | null
          utm_url: string | null
          version: number | null
          view_count: number | null
        }
        Insert: {
          ads_campaigns?: string | null
          category?: string | null
          conversion_count?: number | null
          created_at?: string | null
          created_by?: string | null
          custom_navbar?: string | null
          featured_image?: string | null
          health_score?: number | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          layout_type?: string | null
          meta_description?: string | null
          meta_description_ca?: string | null
          meta_description_en?: string | null
          meta_description_es?: string | null
          meta_title?: string | null
          meta_title_ca?: string | null
          meta_title_en?: string | null
          meta_title_es?: string | null
          notes?: string | null
          primary_cta_text?: string | null
          primary_cta_text_ca?: string | null
          primary_cta_text_en?: string | null
          primary_cta_text_es?: string | null
          primary_cta_url?: string | null
          primary_cta_variant?: string | null
          qr_code?: string | null
          secondary_cta_text?: string | null
          secondary_cta_url?: string | null
          sections?: Json
          slug: string
          slug_ca?: string | null
          slug_en?: string | null
          slug_es?: string | null
          source_site?: Database["public"]["Enums"]["site_source"] | null
          status?: string | null
          title: string
          title_ca?: string | null
          title_en?: string | null
          title_es?: string | null
          updated_at?: string | null
          updated_by?: string | null
          url?: string | null
          use_footer?: boolean | null
          use_navbar?: boolean | null
          utm_url?: string | null
          version?: number | null
          view_count?: number | null
        }
        Update: {
          ads_campaigns?: string | null
          category?: string | null
          conversion_count?: number | null
          created_at?: string | null
          created_by?: string | null
          custom_navbar?: string | null
          featured_image?: string | null
          health_score?: number | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          layout_type?: string | null
          meta_description?: string | null
          meta_description_ca?: string | null
          meta_description_en?: string | null
          meta_description_es?: string | null
          meta_title?: string | null
          meta_title_ca?: string | null
          meta_title_en?: string | null
          meta_title_es?: string | null
          notes?: string | null
          primary_cta_text?: string | null
          primary_cta_text_ca?: string | null
          primary_cta_text_en?: string | null
          primary_cta_text_es?: string | null
          primary_cta_url?: string | null
          primary_cta_variant?: string | null
          qr_code?: string | null
          secondary_cta_text?: string | null
          secondary_cta_url?: string | null
          sections?: Json
          slug?: string
          slug_ca?: string | null
          slug_en?: string | null
          slug_es?: string | null
          source_site?: Database["public"]["Enums"]["site_source"] | null
          status?: string | null
          title?: string
          title_ca?: string | null
          title_en?: string | null
          title_es?: string | null
          updated_at?: string | null
          updated_by?: string | null
          url?: string | null
          use_footer?: boolean | null
          use_navbar?: boolean | null
          utm_url?: string | null
          version?: number | null
          view_count?: number | null
        }
        Relationships: []
      }
      landing_sections: {
        Row: {
          component_type: string
          created_at: string | null
          default_props: Json | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          component_type: string
          created_at?: string | null
          default_props?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          component_type?: string
          created_at?: string | null
          default_props?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      landing_versions: {
        Row: {
          change_summary: string | null
          created_at: string | null
          created_by: string | null
          id: string
          landing_id: string
          snapshot_json: Json
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          landing_id: string
          snapshot_json: Json
          version_number: number
        }
        Update: {
          change_summary?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          landing_id?: string
          snapshot_json?: Json
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "landing_versions_landing_id_fkey"
            columns: ["landing_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_documents: {
        Row: {
          created_at: string | null
          document_name: string
          document_type: string
          file_url: string | null
          id: string
          is_received: boolean | null
          lead_id: string
          notes: string | null
          received_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_name: string
          document_type: string
          file_url?: string | null
          id?: string
          is_received?: boolean | null
          lead_id: string
          notes?: string | null
          received_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_name?: string
          document_type?: string
          file_url?: string | null
          id?: string
          is_received?: boolean | null
          lead_id?: string
          notes?: string | null
          received_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_documents_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "ley_beckham_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_notes: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_internal: boolean | null
          lead_id: string
          note: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_internal?: boolean | null
          lead_id: string
          note: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_internal?: boolean | null
          lead_id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "ley_beckham_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_status_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          from_status:
            | Database["public"]["Enums"]["ley_beckham_lead_status"]
            | null
          id: string
          lead_id: string
          notes: string | null
          to_status: Database["public"]["Enums"]["ley_beckham_lead_status"]
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          from_status?:
            | Database["public"]["Enums"]["ley_beckham_lead_status"]
            | null
          id?: string
          lead_id: string
          notes?: string | null
          to_status: Database["public"]["Enums"]["ley_beckham_lead_status"]
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          from_status?:
            | Database["public"]["Enums"]["ley_beckham_lead_status"]
            | null
          id?: string
          lead_id?: string
          notes?: string | null
          to_status?: Database["public"]["Enums"]["ley_beckham_lead_status"]
        }
        Relationships: [
          {
            foreignKeyName: "lead_status_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "ley_beckham_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      ley_beckham_leads: {
        Row: {
          assigned_to: string | null
          company: string | null
          completed_at: string | null
          contact_lead_id: string | null
          contacted_at: string | null
          country: string
          created_at: string | null
          current_salary: number | null
          eligibility_score: number | null
          email: string
          estimated_move_date: string | null
          id: string
          ip_address: string | null
          job_situation: string
          message: string | null
          name: string
          phone: string | null
          priority: Database["public"]["Enums"]["lead_priority"]
          source_site: Database["public"]["Enums"]["site_source"] | null
          status: Database["public"]["Enums"]["ley_beckham_lead_status"]
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          completed_at?: string | null
          contact_lead_id?: string | null
          contacted_at?: string | null
          country: string
          created_at?: string | null
          current_salary?: number | null
          eligibility_score?: number | null
          email: string
          estimated_move_date?: string | null
          id?: string
          ip_address?: string | null
          job_situation: string
          message?: string | null
          name: string
          phone?: string | null
          priority?: Database["public"]["Enums"]["lead_priority"]
          source_site?: Database["public"]["Enums"]["site_source"] | null
          status?: Database["public"]["Enums"]["ley_beckham_lead_status"]
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          completed_at?: string | null
          contact_lead_id?: string | null
          contacted_at?: string | null
          country?: string
          created_at?: string | null
          current_salary?: number | null
          eligibility_score?: number | null
          email?: string
          estimated_move_date?: string | null
          id?: string
          ip_address?: string | null
          job_situation?: string
          message?: string | null
          name?: string
          phone?: string | null
          priority?: Database["public"]["Enums"]["lead_priority"]
          source_site?: Database["public"]["Enums"]["site_source"] | null
          status?: Database["public"]["Enums"]["ley_beckham_lead_status"]
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ley_beckham_leads_contact_lead_id_fkey"
            columns: ["contact_lead_id"]
            isOneToOne: false
            referencedRelation: "contact_leads"
            referencedColumns: ["id"]
          },
        ]
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
          content_ca: string | null
          content_en: string | null
          content_es: string
          created_at: string | null
          excerpt_ca: string | null
          excerpt_en: string | null
          excerpt_es: string | null
          featured_image_url: string | null
          generated_with_ai: boolean | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          read_time: number | null
          slug_ca: string | null
          slug_en: string | null
          slug_es: string
          source_name: string | null
          source_site: Database["public"]["Enums"]["site_source"] | null
          source_url: string | null
          tags: string[] | null
          title_ca: string | null
          title_en: string | null
          title_es: string
          updated_at: string | null
        }
        Insert: {
          author_avatar_url?: string | null
          author_name?: string | null
          category: string
          content_ca?: string | null
          content_en?: string | null
          content_es: string
          created_at?: string | null
          excerpt_ca?: string | null
          excerpt_en?: string | null
          excerpt_es?: string | null
          featured_image_url?: string | null
          generated_with_ai?: boolean | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug_ca?: string | null
          slug_en?: string | null
          slug_es: string
          source_name?: string | null
          source_site?: Database["public"]["Enums"]["site_source"] | null
          source_url?: string | null
          tags?: string[] | null
          title_ca?: string | null
          title_en?: string | null
          title_es: string
          updated_at?: string | null
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string | null
          category?: string
          content_ca?: string | null
          content_en?: string | null
          content_es?: string
          created_at?: string | null
          excerpt_ca?: string | null
          excerpt_en?: string | null
          excerpt_es?: string | null
          featured_image_url?: string | null
          generated_with_ai?: boolean | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug_ca?: string | null
          slug_en?: string | null
          slug_es?: string
          source_name?: string | null
          source_site?: Database["public"]["Enums"]["site_source"] | null
          source_url?: string | null
          tags?: string[] | null
          title_ca?: string | null
          title_en?: string | null
          title_es?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      news_automation_runs: {
        Row: {
          articles_generated: number
          articles_requested: number
          completed_at: string | null
          created_at: string
          error_details: Json | null
          error_message: string | null
          execution_time_ms: number | null
          id: string
          settings_snapshot: Json | null
          started_at: string
          status: string
          trigger_type: string | null
        }
        Insert: {
          articles_generated?: number
          articles_requested?: number
          completed_at?: string | null
          created_at?: string
          error_details?: Json | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          settings_snapshot?: Json | null
          started_at?: string
          status?: string
          trigger_type?: string | null
        }
        Update: {
          articles_generated?: number
          articles_requested?: number
          completed_at?: string | null
          created_at?: string
          error_details?: Json | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          settings_snapshot?: Json | null
          started_at?: string
          status?: string
          trigger_type?: string | null
        }
        Relationships: []
      }
      news_automation_settings: {
        Row: {
          articles_per_run: number
          auto_publish: boolean
          created_at: string
          default_categories: string[] | null
          default_sources: string[] | null
          id: string
          is_enabled: boolean
          last_run_at: string | null
          next_run_at: string | null
          notify_on_generation: boolean
          run_time: string
          updated_at: string
        }
        Insert: {
          articles_per_run?: number
          auto_publish?: boolean
          created_at?: string
          default_categories?: string[] | null
          default_sources?: string[] | null
          id?: string
          is_enabled?: boolean
          last_run_at?: string | null
          next_run_at?: string | null
          notify_on_generation?: boolean
          run_time?: string
          updated_at?: string
        }
        Update: {
          articles_per_run?: number
          auto_publish?: boolean
          created_at?: string
          default_categories?: string[] | null
          default_sources?: string[] | null
          id?: string
          is_enabled?: boolean
          last_run_at?: string | null
          next_run_at?: string | null
          notify_on_generation?: boolean
          run_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          company: string | null
          consent: boolean
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          source_page: string | null
          source_site: Database["public"]["Enums"]["site_source"] | null
          subscribed_at: string | null
        }
        Insert: {
          company?: string | null
          consent?: boolean
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          source_page?: string | null
          source_site?: Database["public"]["Enums"]["site_source"] | null
          subscribed_at?: string | null
        }
        Update: {
          company?: string | null
          consent?: boolean
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          source_page?: string | null
          source_site?: Database["public"]["Enums"]["site_source"] | null
          subscribed_at?: string | null
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
      nurture_email_log: {
        Row: {
          clicked_at: string | null
          id: string
          lead_email: string
          lead_id: string
          lead_type: string
          opened_at: string | null
          sent_at: string | null
          sequence_id: string | null
          sequence_order: number
          status: string | null
        }
        Insert: {
          clicked_at?: string | null
          id?: string
          lead_email: string
          lead_id: string
          lead_type: string
          opened_at?: string | null
          sent_at?: string | null
          sequence_id?: string | null
          sequence_order: number
          status?: string | null
        }
        Update: {
          clicked_at?: string | null
          id?: string
          lead_email?: string
          lead_id?: string
          lead_type?: string
          opened_at?: string | null
          sent_at?: string | null
          sequence_id?: string | null
          sequence_order?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nurture_email_log_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "email_nurture_sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      page_audits: {
        Row: {
          audit_date: string
          content_score: number | null
          created_at: string
          id: string
          issues: Json | null
          overall_score: number | null
          page_url: string
          raw_data: Json | null
          recommendations: Json | null
          seo_score: number | null
          site_page_id: string | null
          structure_score: number | null
        }
        Insert: {
          audit_date?: string
          content_score?: number | null
          created_at?: string
          id?: string
          issues?: Json | null
          overall_score?: number | null
          page_url: string
          raw_data?: Json | null
          recommendations?: Json | null
          seo_score?: number | null
          site_page_id?: string | null
          structure_score?: number | null
        }
        Update: {
          audit_date?: string
          content_score?: number | null
          created_at?: string
          id?: string
          issues?: Json | null
          overall_score?: number | null
          page_url?: string
          raw_data?: Json | null
          recommendations?: Json | null
          seo_score?: number | null
          site_page_id?: string | null
          structure_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "page_audits_site_page_id_fkey"
            columns: ["site_page_id"]
            isOneToOne: false
            referencedRelation: "site_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_content: {
        Row: {
          content: Json
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          language: string
          page_key: string
          section_key: string
          source_site: Database["public"]["Enums"]["site_source"] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          language?: string
          page_key: string
          section_key: string
          source_site?: Database["public"]["Enums"]["site_source"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          language?: string
          page_key?: string
          section_key?: string
          source_site?: Database["public"]["Enums"]["site_source"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      playbook_leads: {
        Row: {
          company_name: string
          country: string
          created_at: string | null
          downloaded_at: string | null
          email: string
          full_name: string
          id: string
          ip_address: string | null
          job_title: string | null
          playbook_name: string | null
          source_site: string | null
          timeline: string | null
          updated_at: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          company_name: string
          country: string
          created_at?: string | null
          downloaded_at?: string | null
          email: string
          full_name: string
          id?: string
          ip_address?: string | null
          job_title?: string | null
          playbook_name?: string | null
          source_site?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          company_name?: string
          country?: string
          created_at?: string | null
          downloaded_at?: string | null
          email?: string
          full_name?: string
          id?: string
          ip_address?: string | null
          job_title?: string | null
          playbook_name?: string | null
          source_site?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
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
      presentation_modules: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_required: boolean | null
          module_key: string
          name: string
          name_ca: string | null
          name_en: string | null
          objective: string | null
          updated_at: string | null
          variants: Json | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_required?: boolean | null
          module_key: string
          name: string
          name_ca?: string | null
          name_en?: string | null
          objective?: string | null
          updated_at?: string | null
          variants?: Json | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_required?: boolean | null
          module_key?: string
          name?: string
          name_ca?: string | null
          name_en?: string | null
          objective?: string | null
          updated_at?: string | null
          variants?: Json | null
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
      proposal_services: {
        Row: {
          category: string
          created_at: string | null
          default_price: number | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          price_type: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          default_price?: number | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          price_type?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          default_price?: number | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_type?: string | null
        }
        Relationships: []
      }
      proposal_templates: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          file_url: string
          id: string
          is_active: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          file_url: string
          id?: string
          is_active?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          file_url?: string
          id?: string
          is_active?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          client_company: string | null
          client_email: string | null
          client_name: string
          contact_lead_id: string | null
          created_at: string | null
          created_by: string | null
          fees: Json
          id: string
          notes: string | null
          pdf_url: string | null
          proposal_number: string
          services: Json
          status: string | null
          total_amount: number | null
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          client_company?: string | null
          client_email?: string | null
          client_name: string
          contact_lead_id?: string | null
          created_at?: string | null
          created_by?: string | null
          fees?: Json
          id?: string
          notes?: string | null
          pdf_url?: string | null
          proposal_number: string
          services?: Json
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          client_company?: string | null
          client_email?: string | null
          client_name?: string
          contact_lead_id?: string | null
          created_at?: string | null
          created_by?: string | null
          fees?: Json
          id?: string
          notes?: string | null
          pdf_url?: string | null
          proposal_number?: string
          services?: Json
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_contact_lead_id_fkey"
            columns: ["contact_lead_id"]
            isOneToOne: false
            referencedRelation: "contact_leads"
            referencedColumns: ["id"]
          },
        ]
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
      resource_downloads: {
        Row: {
          accepts_marketing: boolean | null
          company: string | null
          created_at: string
          email: string
          id: string
          ip_address: string | null
          name: string
          phone: string | null
          referrer: string | null
          resource_id: string
          source_site: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          accepts_marketing?: boolean | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          name: string
          phone?: string | null
          referrer?: string | null
          resource_id: string
          source_site?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          accepts_marketing?: boolean | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          name?: string
          phone?: string | null
          referrer?: string | null
          resource_id?: string
          source_site?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_downloads_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          benefits: string[] | null
          category: Database["public"]["Enums"]["resource_category"]
          content: string | null
          countries: string[] | null
          created_at: string | null
          description: string | null
          download_count: number | null
          file_url: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          personas: string[] | null
          preview_pages: number | null
          published_at: string | null
          read_time: number | null
          slug: string | null
          source_site: Database["public"]["Enums"]["site_source"] | null
          target_audience: string[] | null
          thumbnail_url: string | null
          title: string
          toc: string[] | null
          type: Database["public"]["Enums"]["resource_type"]
          updated_at: string | null
        }
        Insert: {
          benefits?: string[] | null
          category: Database["public"]["Enums"]["resource_category"]
          content?: string | null
          countries?: string[] | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          personas?: string[] | null
          preview_pages?: number | null
          published_at?: string | null
          read_time?: number | null
          slug?: string | null
          source_site?: Database["public"]["Enums"]["site_source"] | null
          target_audience?: string[] | null
          thumbnail_url?: string | null
          title: string
          toc?: string[] | null
          type: Database["public"]["Enums"]["resource_type"]
          updated_at?: string | null
        }
        Update: {
          benefits?: string[] | null
          category?: Database["public"]["Enums"]["resource_category"]
          content?: string | null
          countries?: string[] | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          personas?: string[] | null
          preview_pages?: number | null
          published_at?: string | null
          read_time?: number | null
          slug?: string | null
          source_site?: Database["public"]["Enums"]["site_source"] | null
          target_audience?: string[] | null
          thumbnail_url?: string | null
          title?: string
          toc?: string[] | null
          type?: Database["public"]["Enums"]["resource_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      review_submissions: {
        Row: {
          company_name: string
          country: string
          created_at: string | null
          full_name: string
          id: string
          ip_address: string | null
          job_title: string | null
          permission_to_publish: boolean | null
          rating: number
          review_text: string
          service_used: string
          source_site: string | null
          status: string | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          company_name: string
          country: string
          created_at?: string | null
          full_name: string
          id?: string
          ip_address?: string | null
          job_title?: string | null
          permission_to_publish?: boolean | null
          rating: number
          review_text: string
          service_used: string
          source_site?: string | null
          status?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          company_name?: string
          country?: string
          created_at?: string | null
          full_name?: string
          id?: string
          ip_address?: string | null
          job_title?: string | null
          permission_to_publish?: boolean | null
          rating?: number
          review_text?: string
          service_used?: string
          source_site?: string | null
          status?: string | null
          updated_at?: string | null
          user_agent?: string | null
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
          area_ca: string | null
          area_en: string | null
          area_es: string
          benefits: string | null
          benefits_ca: string | null
          benefits_en: string | null
          benefits_es: string | null
          created_at: string | null
          created_by: string | null
          description_ca: string | null
          description_en: string | null
          description_es: string
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
          metodologia_ca: Json | null
          metodologia_en: Json | null
          metodologia_es: Json | null
          name_ca: string | null
          name_en: string | null
          name_es: string
          servicios_transversales: Json | null
          servicios_transversales_ca: Json | null
          servicios_transversales_en: Json | null
          servicios_transversales_es: Json | null
          slug_ca: string | null
          slug_en: string | null
          slug_es: string
          source_site: string | null
          stats: Json | null
          stats_ca: Json | null
          stats_en: Json | null
          stats_es: Json | null
          typical_clients: string[]
          typical_clients_ca: string[] | null
          typical_clients_en: string[] | null
          typical_clients_es: string[] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          area_ca?: string | null
          area_en?: string | null
          area_es: string
          benefits?: string | null
          benefits_ca?: string | null
          benefits_en?: string | null
          benefits_es?: string | null
          created_at?: string | null
          created_by?: string | null
          description_ca?: string | null
          description_en?: string | null
          description_es: string
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
          metodologia_ca?: Json | null
          metodologia_en?: Json | null
          metodologia_es?: Json | null
          name_ca?: string | null
          name_en?: string | null
          name_es: string
          servicios_transversales?: Json | null
          servicios_transversales_ca?: Json | null
          servicios_transversales_en?: Json | null
          servicios_transversales_es?: Json | null
          slug_ca?: string | null
          slug_en?: string | null
          slug_es: string
          source_site?: string | null
          stats?: Json | null
          stats_ca?: Json | null
          stats_en?: Json | null
          stats_es?: Json | null
          typical_clients?: string[]
          typical_clients_ca?: string[] | null
          typical_clients_en?: string[] | null
          typical_clients_es?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          area_ca?: string | null
          area_en?: string | null
          area_es?: string
          benefits?: string | null
          benefits_ca?: string | null
          benefits_en?: string | null
          benefits_es?: string | null
          created_at?: string | null
          created_by?: string | null
          description_ca?: string | null
          description_en?: string | null
          description_es?: string
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
          metodologia_ca?: Json | null
          metodologia_en?: Json | null
          metodologia_es?: Json | null
          name_ca?: string | null
          name_en?: string | null
          name_es?: string
          servicios_transversales?: Json | null
          servicios_transversales_ca?: Json | null
          servicios_transversales_en?: Json | null
          servicios_transversales_es?: Json | null
          slug_ca?: string | null
          slug_en?: string | null
          slug_es?: string
          source_site?: string | null
          stats?: Json | null
          stats_ca?: Json | null
          stats_en?: Json | null
          stats_es?: Json | null
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
      site_pages: {
        Row: {
          business_area: string | null
          campaign_name: string | null
          conversion_goal: string | null
          created_at: string | null
          id: string
          is_landing: boolean | null
          is_noindex: boolean | null
          language: string
          last_updated: string | null
          meta_description: string | null
          meta_title: string | null
          notes: string | null
          owner: string | null
          page_type: Database["public"]["Enums"]["page_type"]
          redirect_url: string | null
          source_id: string | null
          source_site: Database["public"]["Enums"]["site_source"] | null
          source_table: string | null
          status: Database["public"]["Enums"]["page_status"]
          title: string
          traffic_source: Database["public"]["Enums"]["traffic_source"] | null
          updated_at: string | null
          url: string
        }
        Insert: {
          business_area?: string | null
          campaign_name?: string | null
          conversion_goal?: string | null
          created_at?: string | null
          id?: string
          is_landing?: boolean | null
          is_noindex?: boolean | null
          language?: string
          last_updated?: string | null
          meta_description?: string | null
          meta_title?: string | null
          notes?: string | null
          owner?: string | null
          page_type?: Database["public"]["Enums"]["page_type"]
          redirect_url?: string | null
          source_id?: string | null
          source_site?: Database["public"]["Enums"]["site_source"] | null
          source_table?: string | null
          status?: Database["public"]["Enums"]["page_status"]
          title: string
          traffic_source?: Database["public"]["Enums"]["traffic_source"] | null
          updated_at?: string | null
          url: string
        }
        Update: {
          business_area?: string | null
          campaign_name?: string | null
          conversion_goal?: string | null
          created_at?: string | null
          id?: string
          is_landing?: boolean | null
          is_noindex?: boolean | null
          language?: string
          last_updated?: string | null
          meta_description?: string | null
          meta_title?: string | null
          notes?: string | null
          owner?: string | null
          page_type?: Database["public"]["Enums"]["page_type"]
          redirect_url?: string | null
          source_id?: string | null
          source_site?: Database["public"]["Enums"]["site_source"] | null
          source_table?: string | null
          status?: Database["public"]["Enums"]["page_status"]
          title?: string
          traffic_source?: Database["public"]["Enums"]["traffic_source"] | null
          updated_at?: string | null
          url?: string
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
          source_site: string | null
          updated_at: string | null
          value: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          source_site?: string | null
          updated_at?: string | null
          value: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          source_site?: string | null
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      sitemap_history: {
        Row: {
          created_at: string
          file_size: number
          generation_time_ms: number | null
          id: string
          storage_url: string | null
          total_urls: number
          trigger_source: string | null
          urls_blog: number
          urls_ca: number
          urls_case_studies: number
          urls_en: number
          urls_es: number
          urls_services: number
          urls_static: number
        }
        Insert: {
          created_at?: string
          file_size: number
          generation_time_ms?: number | null
          id?: string
          storage_url?: string | null
          total_urls: number
          trigger_source?: string | null
          urls_blog?: number
          urls_ca?: number
          urls_case_studies?: number
          urls_en?: number
          urls_es?: number
          urls_services?: number
          urls_static?: number
        }
        Update: {
          created_at?: string
          file_size?: number
          generation_time_ms?: number | null
          id?: string
          storage_url?: string | null
          total_urls?: number
          trigger_source?: string | null
          urls_blog?: number
          urls_ca?: number
          urls_case_studies?: number
          urls_en?: number
          urls_es?: number
          urls_services?: number
          urls_static?: number
        }
        Relationships: []
      }
      sitemap_sync_log: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          errors: Json | null
          id: string
          pages_added: number | null
          pages_archived: number | null
          pages_total: number | null
          pages_updated: number | null
          started_at: string
          status: string
          triggered_by: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          errors?: Json | null
          id?: string
          pages_added?: number | null
          pages_archived?: number | null
          pages_total?: number | null
          pages_updated?: number | null
          started_at?: string
          status?: string
          triggered_by?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          errors?: Json | null
          id?: string
          pages_added?: number | null
          pages_archived?: number | null
          pages_total?: number | null
          pages_updated?: number | null
          started_at?: string
          status?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      social_shares: {
        Row: {
          blog_post_id: string
          created_at: string
          engagement: Json | null
          error_message: string | null
          id: string
          platform: string
          post_id: string | null
          post_url: string | null
          share_text: string | null
          shared_at: string
          status: string
          updated_at: string
        }
        Insert: {
          blog_post_id: string
          created_at?: string
          engagement?: Json | null
          error_message?: string | null
          id?: string
          platform?: string
          post_id?: string | null
          post_url?: string | null
          share_text?: string | null
          shared_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          blog_post_id?: string
          created_at?: string
          engagement?: Json | null
          error_message?: string | null
          id?: string
          platform?: string
          post_id?: string | null
          post_url?: string | null
          share_text?: string | null
          shared_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_shares_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          avatar_url: string | null
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
          position_ca: string | null
          position_en: string | null
          position_es: string
          specialization_ca: string | null
          specialization_en: string | null
          specialization_es: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
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
          position_ca?: string | null
          position_en?: string | null
          position_es: string
          specialization_ca?: string | null
          specialization_en?: string | null
          specialization_es?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
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
          position_ca?: string | null
          position_en?: string | null
          position_es?: string
          specialization_ca?: string | null
          specialization_en?: string | null
          specialization_es?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_name: string
          author_role: string
          avatar_url: string | null
          company_logo_url: string | null
          company_name: string
          company_type: string
          company_type_label: string
          created_at: string | null
          display_order: number | null
          flag_emoji: string
          id: string
          is_active: boolean | null
          location: string
          quote: string
          source_site: string | null
          updated_at: string | null
        }
        Insert: {
          author_name: string
          author_role: string
          avatar_url?: string | null
          company_logo_url?: string | null
          company_name: string
          company_type?: string
          company_type_label?: string
          created_at?: string | null
          display_order?: number | null
          flag_emoji?: string
          id?: string
          is_active?: boolean | null
          location: string
          quote: string
          source_site?: string | null
          updated_at?: string | null
        }
        Update: {
          author_name?: string
          author_role?: string
          avatar_url?: string | null
          company_logo_url?: string | null
          company_name?: string
          company_type?: string
          company_type_label?: string
          created_at?: string | null
          display_order?: number | null
          flag_emoji?: string
          id?: string
          is_active?: boolean | null
          location?: string
          quote?: string
          source_site?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      topbar_config: {
        Row: {
          created_at: string | null
          id: string
          phone_link: string | null
          phone_number: string | null
          show_language_selector: boolean | null
          show_search: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          phone_link?: string | null
          phone_number?: string | null
          show_language_selector?: boolean | null
          show_search?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          phone_link?: string | null
          phone_number?: string | null
          show_language_selector?: boolean | null
          show_search?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      topbar_group_companies: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          is_current: boolean | null
          logo_url: string | null
          name: string
          position: number | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_current?: boolean | null
          logo_url?: string | null
          name: string
          position?: number | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_current?: boolean | null
          logo_url?: string | null
          name?: string
          position?: number | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      topbar_links: {
        Row: {
          created_at: string | null
          href: string
          id: string
          is_active: boolean | null
          is_external: boolean | null
          label: string
          position: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          href: string
          id?: string
          is_active?: boolean | null
          is_external?: boolean | null
          label: string
          position?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          href?: string
          id?: string
          is_active?: boolean | null
          is_external?: boolean | null
          label?: string
          position?: number | null
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
      whistleblower_messages: {
        Row: {
          attachment_urls: string[] | null
          created_at: string
          id: string
          is_visible_to_reporter: boolean
          message: string
          report_id: string
          sender_type: Database["public"]["Enums"]["whistleblower_sender"]
        }
        Insert: {
          attachment_urls?: string[] | null
          created_at?: string
          id?: string
          is_visible_to_reporter?: boolean
          message: string
          report_id: string
          sender_type: Database["public"]["Enums"]["whistleblower_sender"]
        }
        Update: {
          attachment_urls?: string[] | null
          created_at?: string
          id?: string
          is_visible_to_reporter?: boolean
          message?: string
          report_id?: string
          sender_type?: Database["public"]["Enums"]["whistleblower_sender"]
        }
        Relationships: [
          {
            foreignKeyName: "whistleblower_messages_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "whistleblower_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      whistleblower_reports: {
        Row: {
          assigned_to: string | null
          category: Database["public"]["Enums"]["whistleblower_category"]
          contact_email: string | null
          created_at: string
          date_of_incident: string | null
          description: string
          evidence_urls: string[] | null
          id: string
          internal_notes: string | null
          ip_hash: string | null
          is_anonymous: boolean
          location: string | null
          persons_involved: string | null
          priority: Database["public"]["Enums"]["whistleblower_priority"]
          resolution: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["whistleblower_status"]
          tracking_code: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category: Database["public"]["Enums"]["whistleblower_category"]
          contact_email?: string | null
          created_at?: string
          date_of_incident?: string | null
          description: string
          evidence_urls?: string[] | null
          id?: string
          internal_notes?: string | null
          ip_hash?: string | null
          is_anonymous?: boolean
          location?: string | null
          persons_involved?: string | null
          priority?: Database["public"]["Enums"]["whistleblower_priority"]
          resolution?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["whistleblower_status"]
          tracking_code: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["whistleblower_category"]
          contact_email?: string | null
          created_at?: string
          date_of_incident?: string | null
          description?: string
          evidence_urls?: string[] | null
          id?: string
          internal_notes?: string | null
          ip_hash?: string | null
          is_anonymous?: boolean
          location?: string | null
          persons_involved?: string | null
          priority?: Database["public"]["Enums"]["whistleblower_priority"]
          resolution?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["whistleblower_status"]
          tracking_code?: string
          updated_at?: string
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
      calculate_lead_priority: {
        Args: { move_date: string }
        Returns: Database["public"]["Enums"]["lead_priority"]
      }
      calculate_presentation_score: { Args: { p_id: string }; Returns: number }
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
      cleanup_old_sitemap_history: { Args: never; Returns: undefined }
      count_blog_posts:
        | {
            Args: {
              filter_category?: string
              filter_status?: string
              filter_tags?: string[]
              search_query?: string
            }
            Returns: number
          }
        | {
            Args: {
              filter_category?: string
              filter_status?: string
              filter_tags?: string[]
              lang?: string
              search_query?: string
            }
            Returns: number
          }
        | {
            Args: {
              filter_category?: string
              filter_site?: string
              filter_status?: string
              filter_tags?: string[]
              lang?: string
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
      get_ley_beckham_stats: {
        Args: never
        Returns: {
          avg_eligibility_score: number
          conversion_rate: number
          leads_by_country: Json
          leads_by_job_situation: Json
          leads_by_priority: Json
          leads_by_status: Json
          total_leads: number
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
          filter_site?: string
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
          content: string
          created_at: string
          excerpt: string
          featured_image: string
          id: string
          published_at: string
          read_time: number
          shared_sites: string[]
          slug: string
          slug_en: string
          slug_es: string
          source_site: string
          status: string
          tags: string[]
          title: string
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
          challenge_ca: string
          challenge_en: string
          challenge_es: string
          client_industry: string
          client_logo_url: string
          client_name: string
          hero_image_url: string
          hero_subtitle: string
          hero_subtitle_ca: string
          hero_subtitle_en: string
          hero_subtitle_es: string
          hero_title_ca: string
          hero_title_en: string
          hero_title_es: string
          id: string
          is_featured: boolean
          metrics: Json
          primary_service: string
          published_at: string
          relevance: number
          results_summary: string
          results_summary_ca: string
          results_summary_en: string
          results_summary_es: string
          slug: string
          slug_ca: string
          slug_en: string
          slug_es: string
          solution_ca: string
          solution_en: string
          solution_es: string
          status: Database["public"]["Enums"]["case_study_status"]
          tags: string[]
          title: string
          title_ca: string
          title_en: string
          title_es: string
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
      lead_priority: "baja" | "media" | "alta" | "urgente"
      ley_beckham_lead_status:
        | "nuevo"
        | "contactado"
        | "documentacion"
        | "en_proceso"
        | "completado"
        | "descartado"
      page_status: "published" | "draft" | "archived" | "redirect"
      page_type:
        | "home"
        | "service"
        | "landing"
        | "blog"
        | "case_study"
        | "legal"
        | "contact"
        | "about"
        | "careers"
        | "job_position"
        | "other"
      resource_category:
        | "accounting"
        | "tax"
        | "payroll"
        | "corporate_legal"
        | "treasury"
        | "transfer_pricing"
        | "governance"
      resource_type: "white_paper" | "country_guide" | "template" | "webinar"
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
      site_source: "es" | "int" | "audit"
      traffic_source:
        | "seo"
        | "sem"
        | "social"
        | "email"
        | "referral"
        | "direct"
        | "other"
      whistleblower_category:
        | "fraude"
        | "acoso"
        | "corrupcion"
        | "conflicto_intereses"
        | "proteccion_datos"
        | "medioambiente"
        | "seguridad_laboral"
        | "otro"
      whistleblower_priority: "baja" | "media" | "alta" | "critica"
      whistleblower_sender: "denunciante" | "admin"
      whistleblower_status:
        | "nuevo"
        | "en_revision"
        | "investigando"
        | "resuelto"
        | "archivado"
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
      lead_priority: ["baja", "media", "alta", "urgente"],
      ley_beckham_lead_status: [
        "nuevo",
        "contactado",
        "documentacion",
        "en_proceso",
        "completado",
        "descartado",
      ],
      page_status: ["published", "draft", "archived", "redirect"],
      page_type: [
        "home",
        "service",
        "landing",
        "blog",
        "case_study",
        "legal",
        "contact",
        "about",
        "careers",
        "job_position",
        "other",
      ],
      resource_category: [
        "accounting",
        "tax",
        "payroll",
        "corporate_legal",
        "treasury",
        "transfer_pricing",
        "governance",
      ],
      resource_type: ["white_paper", "country_guide", "template", "webinar"],
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
      site_source: ["es", "int", "audit"],
      traffic_source: [
        "seo",
        "sem",
        "social",
        "email",
        "referral",
        "direct",
        "other",
      ],
      whistleblower_category: [
        "fraude",
        "acoso",
        "corrupcion",
        "conflicto_intereses",
        "proteccion_datos",
        "medioambiente",
        "seguridad_laboral",
        "otro",
      ],
      whistleblower_priority: ["baja", "media", "alta", "critica"],
      whistleblower_sender: ["denunciante", "admin"],
      whistleblower_status: [
        "nuevo",
        "en_revision",
        "investigando",
        "resuelto",
        "archivado",
      ],
    },
  },
} as const
