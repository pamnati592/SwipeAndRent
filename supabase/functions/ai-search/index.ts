import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Item = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  city: string | null;
  daily_price: number;
  photos: string[] | null;
  owner_id: string;
};

// Fallback: score items by keyword overlap with the query
function keywordFallback(query: string, items: Item[]): { item_id: string; reason: string; score: number }[] {
  const stopWords = new Set(['i', 'a', 'the', 'to', 'and', 'or', 'for', 'of', 'in', 'want', 'need', 'maybe', 'some', 'with', 'my']);
  const words = query.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !stopWords.has(w));

  const categoryAliases: Record<string, string[]> = {
    gaming: ['game', 'games', 'play', 'console', 'playstation', 'xbox', 'nintendo', 'video', 'mortal', 'kombat', 'ps5', 'ps4'],
    photography: ['photo', 'camera', 'shoot', 'picture', 'pictures', 'lens', 'capture', 'shoot'],
    camping: ['camp', 'tent', 'outdoor', 'hike', 'hiking', 'nature', 'forest', 'mountain'],
    diy: ['drill', 'tool', 'fix', 'build', 'repair', 'power', 'bosch'],
    music: ['guitar', 'drum', 'instrument', 'band', 'song', 'play'],
    sports: ['sport', 'bike', 'bicycle', 'cycle', 'ball', 'run', 'gym'],
  };

  return items
    .map(item => {
      const haystack = [item.title, item.description ?? '', item.category, item.city ?? ''].join(' ').toLowerCase();
      let score = 0;

      // Direct word match in item text
      for (const word of words) {
        if (haystack.includes(word)) score += 20;
      }

      // Category alias match
      const aliases = categoryAliases[item.category] ?? [];
      for (const word of words) {
        if (aliases.includes(word)) score += 30;
      }
      // Bonus if query words match the category name itself
      if (words.includes(item.category)) score += 25;

      return { item_id: item.id, score, reason: `Matches your search for "${words.slice(0, 3).join(', ')}"` };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

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

    // Use service role to bypass RLS — the caller is already authenticated above
    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: items, error: itemsError } = await admin
      .from('items')
      .select('id, title, description, category, city, daily_price, photos, owner_id')
      .eq('verification_status', 'live')
      .eq('is_hidden', false)
      .neq('owner_id', user.id);

    if (itemsError) throw itemsError;
    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const itemsSummary = items.map((item: Item) => ({
      id: item.id,
      title: item.title,
      description: item.description ?? '',
      category: item.category,
      city: item.city ?? '',
      daily_price: item.daily_price,
    }));

    const dateContext = start_date && end_date
      ? `The user needs the item from ${start_date} to ${end_date}.`
      : '';

    const prompt = `You are a rental marketplace assistant helping users find equipment to rent.

User query: "${query}"
${dateContext}

Available items (JSON):
${JSON.stringify(itemsSummary)}

Return a JSON array of the most relevant items ranked by relevance to the query. Include at most 10 results.
For each result return exactly: item_id (string), reason (one short sentence explaining why it matches the query), score (integer 0-100).

Return ONLY a valid JSON array with no markdown, no code fences, no extra text. Example:
[{"item_id":"abc","reason":"Great tent for a weekend camping trip","score":92}]`;

    let ranked: { item_id: string; reason: string; score: number }[] = [];
    let usedFallback = false;

    const groqKey = Deno.env.get('GROQ_KEY');
    if (groqKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            temperature: 0.1,
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        const groqData = await groqRes.json();
        const rawText: string = groqData?.choices?.[0]?.message?.content ?? '';

        if (rawText) {
          const cleaned = rawText.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          if (Array.isArray(parsed) && parsed.length > 0) {
            ranked = parsed;
          }
        }
      } catch {
        // Groq failed — fall through to keyword fallback
      }
    }

    if (ranked.length === 0) {
      ranked = keywordFallback(query, items as Item[]);
      usedFallback = true;
    }

    const itemMap: Record<string, Item> = Object.fromEntries((items as Item[]).map(i => [i.id, i]));
    const results = ranked
      .filter(r => itemMap[r.item_id])
      .map(r => ({ ...itemMap[r.item_id], reason: r.reason, score: r.score }));

    return new Response(JSON.stringify({ results, ai_powered: !usedFallback }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
