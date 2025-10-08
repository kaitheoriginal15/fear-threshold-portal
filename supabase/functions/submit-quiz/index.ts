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

    console.log('Processing quiz for IP:', clientIP);

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
      console.log('Returning existing result for IP:', clientIP);
      return new Response(
        JSON.stringify({ 
          group: existingResult.group_result,
          isExisting: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // New quiz submission - calculate result
    const { answers } = await req.json();
    
    if (!answers || !Array.isArray(answers) || answers.length !== 10) {
      throw new Error('Invalid answers format');
    }

    // Calculate personality scores based on answers
    const scores = {
      hawise: 0,    // euphoric, battle-loving
      jocosa: 0,    // lightness, tranquil
      dragomir: 0,  // peace, balanced
      brenda: 0     // intelligent, analytical
    };

    // Score each answer (0-3 points per question)
    answers.forEach((answer: string, index: number) => {
      switch (index) {
        case 0: // Situação de conflito
          if (answer === 'A') scores.hawise += 3;
          else if (answer === 'B') scores.brenda += 3;
          else if (answer === 'C') scores.dragomir += 3;
          else scores.jocosa += 3;
          break;
        case 1: // Momento de relaxar
          if (answer === 'A') scores.jocosa += 3;
          else if (answer === 'B') scores.brenda += 3;
          else if (answer === 'C') scores.dragomir += 3;
          else scores.hawise += 3;
          break;
        case 2: // Problema difícil
          if (answer === 'A') scores.hawise += 3;
          else if (answer === 'B') scores.jocosa += 3;
          else if (answer === 'C') scores.brenda += 3;
          else scores.dragomir += 3;
          break;
        case 3: // Descreve você
          if (answer === 'A') scores.hawise += 3;
          else if (answer === 'B') scores.jocosa += 3;
          else if (answer === 'C') scores.dragomir += 3;
          else scores.brenda += 3;
          break;
        case 4: // Fim de semana
          if (answer === 'A') scores.hawise += 3;
          else if (answer === 'B') scores.jocosa += 3;
          else if (answer === 'C') scores.dragomir += 3;
          else scores.brenda += 3;
          break;
        case 5: // Tomar decisão
          if (answer === 'A') scores.brenda += 3;
          else if (answer === 'B') scores.hawise += 3;
          else if (answer === 'C') scores.jocosa += 3;
          else scores.dragomir += 3;
          break;
        case 6: // Grupo de amigos
          if (answer === 'A') scores.hawise += 3;
          else if (answer === 'B') scores.jocosa += 3;
          else if (answer === 'C') scores.dragomir += 3;
          else scores.brenda += 3;
          break;
        case 7: // Desafio
          if (answer === 'A') scores.hawise += 3;
          else if (answer === 'B') scores.brenda += 3;
          else if (answer === 'C') scores.jocosa += 3;
          else scores.dragomir += 3;
          break;
        case 8: // Estressado
          if (answer === 'A') scores.hawise += 3;
          else if (answer === 'B') scores.dragomir += 3;
          else if (answer === 'C') scores.jocosa += 3;
          else scores.brenda += 3;
          break;
        case 9: // Maior qualidade
          if (answer === 'A') scores.hawise += 3;
          else if (answer === 'B') scores.jocosa += 3;
          else if (answer === 'C') scores.dragomir += 3;
          else scores.brenda += 3;
          break;
      }
    });

    // Find the highest score
    const groupResult = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0];

    console.log('Quiz scores:', scores);
    console.log('Determined group:', groupResult);

    // Save the result
    const { error: insertError } = await supabase
      .from('quiz_results')
      .insert({
        ip_address: clientIP,
        group_result: groupResult
      });

    if (insertError) {
      console.error('Error saving result:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        group: groupResult,
        isExisting: false 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in submit-quiz function:', error);
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
