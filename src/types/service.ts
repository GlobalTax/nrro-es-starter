export interface ServiceMetodologia {
  overline: string;
  titulos: string[];
  contacto: {
    telefono: string;
    email: string;
  };
  introduccion: string;
  pilares: Array<{
    numero: number;
    titulo: string;
    puntos: string[];
  }>;
}

export interface ServiceTransversal {
  titulo: string;
  contenido: string;
}

export interface ServiceStat {
  label: string;
  value: string;
  description: string;
}

export interface Service {
  id: string;
  name: string; // Mapped from name_es/ca/en
  slug: string; // Mapped from slug_es/ca/en
  description: string; // Mapped from description_es/ca/en
  icon_name: string;
  area: 'Fiscal' | 'Contable' | 'Legal' | 'Laboral'; // Mapped from area_es/ca/en
  features: string[];
  benefits?: string;
  typical_clients: string[];
  
  metodologia?: ServiceMetodologia;
  servicios_transversales?: ServiceTransversal[];
  stats?: ServiceStat[];
  
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  meta_title?: string;
  meta_description?: string;
  source_site?: 'es' | 'int';
  
  // Raw DB fields (for admin)
  name_es?: string;
  name_ca?: string;
  name_en?: string;
  slug_es?: string;
  slug_ca?: string;
  slug_en?: string;
  description_es?: string;
  description_ca?: string;
  description_en?: string;
  area_es?: string;
  area_ca?: string;
  area_en?: string;
}

export interface ServiceFormData extends Omit<Service, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'> {}
