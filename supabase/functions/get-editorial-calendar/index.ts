import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    let daysAhead = 30;
    let includeAll = false;

    try {
      const body = await req.json();
      daysAhead = body.daysAhead || 30;
      includeAll = body.includeAll || false;
    } catch {
      // Use defaults if no body
    }

    console.log(`[get-editorial-calendar] Fetching events for next ${daysAhead} days`);

    const today = new Date();
    const futureDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    const currentYear = today.getFullYear();

    // Get all active calendar events
    let query = supabase
      .from("editorial_calendar_events")
      .select("*")
      .eq("is_active", true)
      .order("event_date", { ascending: true });

    const { data: events, error } = await query;

    if (error) {
      throw new Error(`Error fetching calendar events: ${error.message}`);
    }

    // Process events - adjust yearly events to current year
    const processedEvents = events?.map(event => {
      const eventDate = new Date(event.event_date);
      
      // For yearly recurrence, adjust to current or next year
      if (event.recurrence === "yearly") {
        eventDate.setFullYear(currentYear);
        
        // If the date has passed this year, move to next year
        if (eventDate < today) {
          eventDate.setFullYear(currentYear + 1);
        }
      }

      // Calculate publish suggestion date
      const publishDate = new Date(eventDate.getTime() - (event.days_before_publish || 7) * 24 * 60 * 60 * 1000);

      // Replace placeholders in topic template
      const suggestedTopic = event.suggested_topic_template
        ?.replace("{year}", eventDate.getFullYear().toString())
        ?.replace("{year+1}", (eventDate.getFullYear() + 1).toString())
        ?.replace("{model}", "111/115");

      return {
        ...event,
        event_date: eventDate.toISOString().split("T")[0],
        suggested_publish_date: publishDate.toISOString().split("T")[0],
        suggested_topic: suggestedTopic,
        is_upcoming: publishDate <= futureDate && publishDate >= today,
        days_until_event: Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
        days_until_publish: Math.ceil((publishDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      };
    }) || [];

    // Filter to upcoming events unless includeAll is true
    const upcomingEvents = includeAll 
      ? processedEvents 
      : processedEvents.filter(e => e.is_upcoming);

    // Sort by publish date
    upcomingEvents.sort((a, b) => 
      new Date(a.suggested_publish_date).getTime() - new Date(b.suggested_publish_date).getTime()
    );

    // Get existing blog posts to check what topics are already covered
    const { data: existingPosts } = await supabase
      .from("blog_posts")
      .select("title_es, category, created_at")
      .gte("created_at", new Date(today.getFullYear(), 0, 1).toISOString())
      .order("created_at", { ascending: false })
      .limit(50);

    // Mark events that might already have coverage
    const eventsWithCoverage = upcomingEvents.map(event => {
      const relatedPosts = existingPosts?.filter(post => {
        const titleLower = post.title_es?.toLowerCase() || "";
        const eventNameLower = event.event_name.toLowerCase();
        const categoryMatch = post.category?.toLowerCase() === event.suggested_category?.toLowerCase();
        
        // Simple matching - check if title contains key words from event
        const keywords = eventNameLower.split(/\s+/).filter((w: string) => w.length > 3);
        const hasKeywordMatch = keywords.some((kw: string) => titleLower.includes(kw));
        
        return categoryMatch && hasKeywordMatch;
      }) || [];

      return {
        ...event,
        has_coverage: relatedPosts.length > 0,
        related_posts: relatedPosts.slice(0, 3),
      };
    });

    console.log(`[get-editorial-calendar] Found ${eventsWithCoverage.length} events`);

    return new Response(
      JSON.stringify({
        success: true,
        events: eventsWithCoverage,
        total: eventsWithCoverage.length,
        uncovered: eventsWithCoverage.filter(e => !e.has_coverage).length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("[get-editorial-calendar] Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
