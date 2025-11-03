import { usePageContent } from './usePageContent';

interface DatoItem {
  categoria: string;
  valor: string;
  descripcion: string;
}

const DEFAULT_DATOS: DatoItem[] = [
  {
    categoria: "Clientes",
    valor: "300+",
    descripcion: "Más de 300 empresas familiares y grupos confían en navarro."
  },
  {
    categoria: "Proyectos",
    valor: "500+",
    descripcion: "Operaciones de reestructuración, sucesión y M&A completadas con éxito."
  },
  {
    categoria: "Años de experiencia",
    valor: "25+",
    descripcion: "Trayectoria sólida acompañando a empresas familiares en su crecimiento."
  },
  {
    categoria: "Equipo",
    valor: "70+",
    descripcion: "Abogados y profesionales especializados en fiscal, mercantil, laboral y M&A."
  },
  {
    categoria: "Compromiso",
    valor: "100%",
    descripcion: "Dedicación total a cada mandato, con rigor técnico y confidencialidad."
  },
  {
    categoria: "Operaciones M&A",
    valor: "100+",
    descripcion: "Mandatos de compra y venta asesorados con un enfoque integral."
  }
];

export const useHomeDatos = () => {
  const { data: contentData, isLoading } = usePageContent('home', 'datos');
  
  const datos: DatoItem[] = contentData && contentData.length > 0
    ? (contentData[0].content as any).items
    : DEFAULT_DATOS;
  
  return { datos, isLoading };
};
