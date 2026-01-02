import { supabase } from '@/integrations/supabase/client';

export async function fixHerenciasLanding() {
  console.log('🔄 Corrigiendo landing de herencias...');
  
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

  const sections = landing.sections as any[];
  
  // Cambiar hero background a 'dark' (fondo negro con texto blanco)
  const updatedSections = sections.map((section: any) => {
    if (section.type === 'hero') {
      return {
        ...section,
        props: {
          ...section.props,
          background: 'dark'
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
    console.log('✅ Hero con fondo negro (dark)');
    console.log('✅ Recarga la página para ver los cambios');
  }
}
