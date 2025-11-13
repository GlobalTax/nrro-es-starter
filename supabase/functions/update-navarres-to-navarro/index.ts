import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const updates = [];

    // 1. Update home -> about section
    const { data: homeAbout, error: error1 } = await supabase
      .from('page_content')
      .select('id, content')
      .eq('page_key', 'home')
      .eq('section_key', 'about')
      .eq('language', 'ca')
      .single();

    if (homeAbout && !error1) {
      const updatedContent = JSON.stringify(homeAbout.content)
        .replace(/navarrès/g, 'navarro');
      
      const { error: updateError1 } = await supabase
        .from('page_content')
        .update({ content: JSON.parse(updatedContent) })
        .eq('id', homeAbout.id);

      if (!updateError1) {
        updates.push({ section: 'home->about', status: 'updated' });
      }
    }

    // 2. Update about -> hero section
    const { data: aboutHero, error: error2 } = await supabase
      .from('page_content')
      .select('id, content')
      .eq('page_key', 'about')
      .eq('section_key', 'hero')
      .eq('language', 'ca')
      .single();

    if (aboutHero && !error2) {
      const updatedContent = JSON.stringify(aboutHero.content)
        .replace(/navarrès/g, 'navarro');
      
      const { error: updateError2 } = await supabase
        .from('page_content')
        .update({ content: JSON.parse(updatedContent) })
        .eq('id', aboutHero.id);

      if (!updateError2) {
        updates.push({ section: 'about->hero', status: 'updated' });
      }
    }

    // 3. Update about -> story section
    const { data: aboutStory, error: error3 } = await supabase
      .from('page_content')
      .select('id, content')
      .eq('page_key', 'about')
      .eq('section_key', 'story')
      .eq('language', 'ca')
      .single();

    if (aboutStory && !error3) {
      const updatedContent = JSON.stringify(aboutStory.content)
        .replace(/navarrès/g, 'navarro');
      
      const { error: updateError3 } = await supabase
        .from('page_content')
        .update({ content: JSON.parse(updatedContent) })
        .eq('id', aboutStory.id);

      if (!updateError3) {
        updates.push({ section: 'about->story', status: 'updated' });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contenido actualizado correctamente',
        updates,
        totalUpdates: updates.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error updating content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
