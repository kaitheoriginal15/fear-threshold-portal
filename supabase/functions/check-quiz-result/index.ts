import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client IP from headers
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    const { userId } = await req.json();
    
    console.log('Checking quiz result for IP:', clientIP, 'User ID:', userId);

    // Check if user is admin
    let isAdmin = false;
    if (userId) {
      const { data: roleData } = await supabase
        .rpc('has_role', { _user_id: userId, _role: 'admin' });
      isAdmin = roleData || false;
      console.log('Is admin:', isAdmin);
    }

    // Admins can always retake the quiz
    if (isAdmin) {
      console.log('Admin user - allowing quiz retake');
      return new Response(
        JSON.stringify({ hasResult: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if IP already has a result
    const { data: existingResult, error: checkError } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('ip_address', clientIP)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing result:', checkError);
      throw checkError;
    }

    if (existingResult) {
      console.log('Found existing result for IP:', clientIP);
      return new Response(
        JSON.stringify({ 
          hasResult: true,
          group: existingResult.group_result
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ hasResult: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in check-quiz-result function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
