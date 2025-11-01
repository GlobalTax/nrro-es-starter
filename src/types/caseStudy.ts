export type CaseStudyStatus = 'draft' | 'review' | 'published' | 'archived';

export interface CaseStudyMetric {
  label: string;
  value: string;
  description?: string;
  icon?: string;
}

export interface CaseStudyTimelineEvent {
  date: string;
  title: string;
  description: string;
}

export interface CaseStudyGalleryImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface CaseStudyTestimonial {
  text: string;
  author: string;
  position: string;
  avatar_url?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  client_logo_url: string | null;
  client_industry: string;
  client_size: string | null;
  project_duration: string | null;
  
  meta_title: string | null;
  meta_description: string | null;
  
  hero_image_url: string | null;
  hero_title: string;
  hero_subtitle: string | null;
  
  challenge: string;
  solution: string;
  results_summary: string;
  
  metrics: CaseStudyMetric[];
  detailed_content: string | null;
  timeline: CaseStudyTimelineEvent[];
  
  testimonial_text: string | null;
  testimonial_author: string | null;
  testimonial_position: string | null;
  testimonial_avatar_url: string | null;
  
  related_services: string[];
  gallery: CaseStudyGalleryImage[];
  
  tags: string[];
  primary_service: string | null;
  
  status: CaseStudyStatus;
  is_featured: boolean;
  display_order: number;
  view_count: number;
  
  created_at: string;
  updated_at: string;
  published_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}

export interface CaseStudyFormData {
  title: string;
  slug: string;
  client_name: string;
  client_logo_url: string | null;
  client_industry: string;
  client_size: string;
  project_duration: string;
  
  meta_title: string;
  meta_description: string;
  
  hero_image_url: string | null;
  hero_title: string;
  hero_subtitle: string;
  
  challenge: string;
  solution: string;
  results_summary: string;
  
  metrics: CaseStudyMetric[];
  detailed_content: string;
  timeline: CaseStudyTimelineEvent[];
  
  testimonial_text: string;
  testimonial_author: string;
  testimonial_position: string;
  testimonial_avatar_url: string | null;
  
  related_services: string[];
  gallery: CaseStudyGalleryImage[];
  
  tags: string[];
  primary_service: string;
  
  status: CaseStudyStatus;
  is_featured: boolean;
  display_order: number;
}
