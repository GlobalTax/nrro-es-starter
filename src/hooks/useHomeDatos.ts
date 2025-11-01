import { usePageContent } from './usePageContent';
import { LucideIcon, Users, Briefcase, Clock, UserCheck, Target, Handshake } from 'lucide-react';

interface DatoItem {
  categoria: string;
  valor: string;
  descripcion: string;
  icon?: LucideIcon;
}

// Mapeo de iconos por categoría
const iconMap: Record<string, LucideIcon> = {
  'Clientes': Users,
  'Proyectos': Briefcase,
  'Años de experiencia': Clock,
  'Equipo': UserCheck,
  'Compromiso': Target,
  'Operaciones M&A': Handshake,
};

const DEFAULT_DATOS: DatoItem[] = [
  {
    categoria: "Clientes",
    valor: "300+",
    descripcion: "Más de 300 empresas familiares y grupos confían en navarro.",
    icon: Users
  },
  {
    categoria: "Proyectos",
    valor: "500+",
    descripcion: "Operaciones de reestructuración, sucesión y M&A completadas con éxito.",
    icon: Briefcase
  },
  {
    categoria: "Años de experiencia",
    valor: "25+",
    descripcion: "Trayectoria sólida acompañando a empresas familiares en su crecimiento.",
    icon: Clock
  },
  {
    categoria: "Equipo",
    valor: "70+",
    descripcion: "Abogados y profesionales especializados en fiscal, mercantil, laboral y M&A.",
    icon: UserCheck
  },
  {
    categoria: "Compromiso",
    valor: "100%",
    descripcion: "Dedicación total a cada mandato, con rigor técnico y confidencialidad.",
    icon: Target
  },
  {
    categoria: "Operaciones M&A",
    valor: "100+",
    descripcion: "Mandatos de compra y venta asesorados con un enfoque integral.",
    icon: Handshake
  }
];

export const useHomeDatos = () => {
  const { data: contentData, isLoading } = usePageContent('home', 'datos');
  
  let datos: DatoItem[] = contentData && contentData.length > 0
    ? (contentData[0].content as any).items
    : DEFAULT_DATOS;
  
  // Añadir iconos si no están en la BD
  datos = datos.map(dato => ({
    ...dato,
    icon: dato.icon || iconMap[dato.categoria]
  }));
  
  return { datos, isLoading };
};
