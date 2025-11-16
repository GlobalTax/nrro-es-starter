import { supabase } from '@/integrations/supabase/client';

export async function updateHerenciasTrustBar() {
  console.log('🔄 Actualizando trust-bar de la landing...');
  
  // Obtener la landing actual
  const { data: landing, error: fetchError } = await supabase
    .from('landing_pages')
    .select('sections')
    .eq('slug', 'abogados-herencias-barcelona')
    .single();

  if (fetchError || !landing) {
    console.error('❌ Error al obtener la landing:', fetchError);
    return;
  }

  // Actualizar solo la sección trust-bar
  const sections = landing.sections as any[];
  const updatedSections = sections.map((section: any) => {
    if (section.type === 'trust-bar') {
      return {
        ...section,
        props: {
          heading: 'Más de 500 empresas confían en nosotros desde 1998',
          subtitle: '🏛️ Navarro Tax Legal • Ilustre Colegio de Abogados de Barcelona • Registro de Asesores Fiscales',
          stats: [
            { value: '500+', label: 'Empresas Registradas' },
            { value: '25', label: 'Años de Experiencia' },
            { value: '50+', label: 'Países Atendidos' },
            { value: '99%', label: 'Tasa de Éxito' }
          ]
        }
      };
    }
    return section;
  });

  // Guardar los cambios
  const { error: updateError } = await supabase
    .from('landing_pages')
    .update({ 
      sections: updatedSections,
      updated_at: new Date().toISOString()
    })
    .eq('slug', 'abogados-herencias-barcelona');

  if (updateError) {
    console.error('❌ Error al actualizar:', updateError);
  } else {
    console.log('✅ Trust bar actualizada con textos en español');
    console.log('✅ Recarga la página para ver los cambios');
  }
}
