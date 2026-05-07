import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { query, start_date, end_date } = await req.json();
    if (!query?.trim()) {
      return new Response(JSON.stringify({ error: 'query is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('id, title, description, category, city, daily_price, photos')
      .eq('verification_status', 'live')
      .eq('is_hidden', false)
      .neq('owner_id', user.id);

    if (itemsError) throw itemsError;
    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const dateContext = start_date && end_date
      ? `The user needs the item from ${start_date} to ${end_date}.`
      : '';

    const itemsSummary = items.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description ?? '',
      category: item.category,
      city: item.city ?? '',
      daily_price: item.daily_price,
    }));

    const prompt = `You are a rental marketplace assistant helping users find equipment to rent.

User query: "${query}"
${dateContext}

Available items (JSON):
${JSON.stringify(itemsSummary)}

Return a JSON array of the most relevant items ranked by relevance to the query. Include at most 10 results.
For each result return exactly: item_id (string), reason (one short sentence explaining why it matches the query), score (integer 0-100).

Return ONLY a valid JSON array with no markdown, no code fences, no extra text. Example:
[{"item_id":"abc","reason":"Great tent for a weekend camping trip","score":92}]`;

    const geminiKey = Deno.env.get('GEMINI_KEY');
    if (!geminiKey) throw new Error('GEMINI_KEY secret is not configured');

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
        }),
      }
    );

    const geminiData = await geminiRes.json();
    const rawText: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]';
    const cleaned = rawText.replace(/```json?\n?/g, '').replace(/```/g, '').trim();

    let ranked: { item_id: string; reason: string; score: number }[] = [];
    try {
      ranked = JSON.parse(cleaned);
      if (!Array.isArray(ranked)) ranked = [];
    } catch {
      ranked = [];
    }

    const itemMap: Record<string, typeof items[0]> = Object.fromEntries(items.map(i => [i.id, i]));
    const results = ranked
      .filter(r => itemMap[r.item_id])
      .map(r => ({ ...itemMap[r.item_id], reason: r.reason, score: r.score }));

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
