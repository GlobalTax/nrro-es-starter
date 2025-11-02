// Script temporal para insertar datos iniciales de tecnología
// Ejecutar manualmente desde la consola del navegador o como función auxiliar

import { supabase } from '@/integrations/supabase/client';

export const insertTechnologyData = async () => {
  const technologyContent = {
    overline: "Tecnología que usamos",
    title: "Herramientas profesionales para un servicio excepcional",
    technologies: [
      {
        name: "Sage",
        category: "ERP Contable",
        description: "Gestión contable y financiera integral para empresas",
        mockup_url: "/assets/mockups/sage-dashboard.jpg",
        featured: true,
        order: 1
      },
      {
        name: "A3 Software",
        category: "Gestión Empresarial",
        description: "Asesoría, nóminas y gestión de recursos humanos",
        mockup_url: "/assets/mockups/a3-software-dashboard.jpg",
        featured: true,
        order: 2
      },
      {
        name: "Wolters Kluwer",
        category: "Normativa Fiscal",
        description: "Base de datos legal y fiscal actualizada",
        mockup_url: "/assets/mockups/wolters-kluwer.jpg",
        featured: false,
        order: 3
      },
      {
        name: "Microsoft 365",
        category: "Productividad",
        description: "Suite completa de herramientas empresariales",
        mockup_url: "/assets/mockups/microsoft-365.jpg",
        featured: false,
        order: 4
      },
      {
        name: "DocuSign",
        category: "Firma Digital",
        description: "Firma electrónica segura y legalmente válida",
        mockup_url: "/assets/mockups/docusign.jpg",
        featured: false,
        order: 5
      },
      {
        name: "Lexnet",
        category: "Justicia Digital",
        description: "Notificaciones judiciales y gestión procesal",
        mockup_url: "/assets/mockups/lexnet.jpg",
        featured: false,
        order: 6
      }
    ]
  };

  const { data, error } = await supabase
    .from('page_content')
    .insert({
      page_key: 'home',
      section_key: 'tecnologia',
      content: technologyContent as any,
      is_active: true
    })
    .select();

  if (error) {
    console.error('Error insertando datos:', error);
    return { success: false, error };
  }

  console.log('Datos insertados correctamente:', data);
  return { success: true, data };
};

// Para ejecutar desde consola del navegador:
// import { insertTechnologyData } from '@/scripts/insertTechnologyData';
// insertTechnologyData();
