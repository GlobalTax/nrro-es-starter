export interface JobPosition {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  contract_type: string;
  working_hours: string;
  salary_range?: string;
  description?: string;
  requirements: string[];
  responsibilities: string[];
  status: 'draft' | 'published' | 'closed';
  is_featured: boolean;
  display_order: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export type JobPositionFormData = Omit<JobPosition, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>;
