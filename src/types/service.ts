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
  name: string;
  slug: string;
  description: string;
  icon_name: string;
  area: 'Fiscal' | 'Contable' | 'Legal' | 'Laboral';
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
}

export interface ServiceFormData extends Omit<Service, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'> {}
