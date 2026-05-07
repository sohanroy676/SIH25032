import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

function makeCorsHeaders(origin: string | null) {
  const allowOrigin = origin && origin.startsWith('http') ? origin : '*';
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  } as Record<string,string>;
}

type Place = {
  name: string;
  short_desc: string;
  tags: string[];
  likely_coordinates: { lat: number; lon: number } | null;
  likely_festivals: { name: string; dateShort?: string }[];
  confidence_score: number;
};

async function callGemini(state: string): Promise<Place[]> {
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing');
  const prompt = `
You are an expert travel guide specializing in Indian tourism destinations.

TASK: Return ONLY a JSON array (no prose) of up to 12 notable tourist places for the Indian state "${state}".

Each array item MUST strictly be an object with these fields:
{
  "name": string,
  "short_desc": string,         // 40-60 words, engaging description
  "tags": string[],             // e.g. ["nature","historical","waterfall","adventure"]
  "likely_coordinates": {"lat": number, "lon": number} | null,
  "likely_festivals": [{"name": string, "dateShort"?: string}],
  "confidence_score": number,   // 0..1
  "category": string,           // "nature", "historical", "cultural", "adventure", "religious"
  "best_season": string,        // "monsoon", "winter", "summer", "year-round"
  "highlights": string[]        // 3-5 key highlights/features
}

RULES:
- Respond ONLY with a valid JSON array (no markdown, no backticks, no commentary)
- Include diverse types of attractions (nature, history, culture, adventure)
- Focus on well-known, accessible destinations
- Provide accurate coordinates when possible
- Make descriptions engaging and informative
- Include local festivals and seasonal information
`;
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 1200 } })
  });
  if (!res.ok) throw new Error('Gemini request failed: ' + (await res.text()));
  const data = await res.json();
  // Extract text
  let text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]';
  console.log('[places-fetch] raw gemini chars:', text?.length ?? 0);
  if (text) console.log('[places-fetch] raw gemini head:', text.slice(0, 160));
  // Sanitize common wrappers like ```json ... ```
  const fence = text.match(/```json[\s\S]*?```/i) || text.match(/```[\s\S]*?```/);
  if (fence && fence[0]) {
    text = fence[0].replace(/```json|```/gi, '').trim();
  }
  // Fallback: attempt to find first [ ... ] block
  if (!text.trim().startsWith('[')) {
    const m = text.match(/\[[\s\S]*\]/);
    if (m) text = m[0];
  }
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.error('[places-fetch] JSON parse failed; returning empty list');
    return [];
  }
}

async function fetchImageUrls(query: string): Promise<string[]> {
  const UNSPLASH_KEY = Deno.env.get('IMAGE_API_KEY');
  if (!UNSPLASH_KEY) return [];
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=2&orientation=landscape&client_id=${UNSPLASH_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const j = await res.json();
  return (j.results || []).slice(0, 2).map((r: any) => r.urls?.regular).filter(Boolean);
}

serve(async (req) => {
  const origin = req.headers.get('Origin');
  const corsHeaders = makeCorsHeaders(origin);
  console.log('[places-fetch] start');
  if (req.method === 'OPTIONS') return new Response('ok', { headers: { ...corsHeaders } });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { ...corsHeaders } });
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return new Response('Server not configured', { status: 500, headers: { ...corsHeaders } });

  const { state } = await req.json().catch(() => ({ state: 'Jharkhand' }));
  console.log('[places-fetch] requested state:', state);
  
  // Check cache first - look for places cached within last 7 days
  const cacheThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const cachedPlaces = await fetch(`${url}/rest/v1/places?state=eq.${state}&gemini_cached_at=gte.${cacheThreshold}&select=gemini_cache_json,name,short_desc,lat,lon,tags,images`, {
    headers: { 'Authorization': `Bearer ${key}`, 'apiKey': key }
  });
  
  let places: Place[] = [];
  let fromCache = false;
  
  if (cachedPlaces.ok) {
    const cachedData = await cachedPlaces.json();
    console.log('[places-fetch] cached data found:', cachedData.length, 'entries');
    
    if (Array.isArray(cachedData) && cachedData.length > 0) {
      // Check if we have valid cached content
      const validCachedPlaces = cachedData.filter(item => 
        item.gemini_cache_json && 
        item.gemini_cache_json.name && 
        item.gemini_cache_json.short_desc
      );
      
      if (validCachedPlaces.length > 0) {
        places = validCachedPlaces.map(item => item.gemini_cache_json);
        fromCache = true;
        console.log('[places-fetch] using cached places:', places.length);
      } else {
        console.log('[places-fetch] cached data found but invalid, will call Gemini');
      }
    }
  }
  
  // If no valid cache, call Gemini
  if (!fromCache || places.length === 0) {
    console.log('[places-fetch] calling Gemini API for state:', state);
    try {
      places = await callGemini(state);
      console.log('[places-fetch] gemini places length:', Array.isArray(places) ? places.length : 'not-array');
    } catch (e) {
      console.error('[places-fetch] gemini error:', e);
      return new Response(`Gemini error: ${String(e)}`, { status: 500, headers: { ...corsHeaders } });
    }
  } else {
    console.log('[places-fetch] serving from cache, skipping Gemini call');
  }

  // Fallback: seed a minimal list if Gemini returned nothing
  if (!Array.isArray(places) || places.length === 0) {
    console.warn('[places-fetch] gemini returned 0; using fallback seed');
    if (state.toLowerCase() === 'jharkhand') {
      places = [
        { name: 'Dassam Falls', short_desc: 'A scenic waterfall near Ranchi, popular for day trips.', tags: ['nature','waterfall'], likely_coordinates: { lat: 23.251, lon: 85.582 }, likely_festivals: [], confidence_score: 0.9 },
        { name: 'Hundru Falls', short_desc: 'Tall waterfall on the Subarnarekha River with viewpoints.', tags: ['nature','waterfall'], likely_coordinates: { lat: 23.284, lon: 85.358 }, likely_festivals: [], confidence_score: 0.88 },
        { name: 'Netarhat', short_desc: 'Hill station known as the Queen of Chotanagpur.', tags: ['nature','hill'], likely_coordinates: { lat: 23.471, lon: 84.267 }, likely_festivals: [], confidence_score: 0.86 },
        { name: 'Betla National Park', short_desc: 'Wildlife reserve with elephants and rich biodiversity.', tags: ['nature','park'], likely_coordinates: { lat: 23.847, lon: 84.199 }, likely_festivals: [], confidence_score: 0.84 },
      ] as Place[];
    }
  }

  let inserted = 0;
  const failures: Array<{ name: string; error: string }> = [];
  for (const p of places) {
    console.log('[places-fetch] upserting place:', p?.name);
    const q = `${p.name} ${state}`;
    const images = await fetchImageUrls(q);
    // Map first tag to allowed type values
    const allowed = ['nature','historical','cultural'];
    let mappedType: string | null = null;
    if (Array.isArray(p.tags)) {
      const t0 = (p.tags[0] || '').toString().toLowerCase();
      mappedType = allowed.includes(t0) ? t0 : null;
    }
    const upsert = await fetch(`${url}/rest/v1/places?on_conflict=name,state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}`, 'apiKey': key, 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({
        name: p.name,
        state,
        type: mappedType,
        lat: p.likely_coordinates?.lat ?? null,
        lon: p.likely_coordinates?.lon ?? null,
        short_desc: p.short_desc,
        images: images || [],
        tags: Array.isArray(p.tags) ? p.tags : [],
        gemini_cache_json: p,
        gemini_cached_at: new Date().toISOString()
      })
    });
    if (!upsert.ok) {
      const t = await upsert.text();
      console.error('[places-fetch] upsert failed for', p.name, t);
      failures.push({ name: p.name, error: t.slice(0, 200) });
    } else {
      console.log('[places-fetch] upsert ok for', p.name);
      inserted++;
    }
  }

  // Return the places data directly for immediate frontend display
  const placesForFrontend = places.map(p => ({
    place_id: crypto.randomUUID(), // Generate temporary ID for frontend
    name: p.name,
    short_desc: p.short_desc,
    images: [], // Will be populated by the upsert process
    lat: p.likely_coordinates?.lat ?? null,
    lon: p.likely_coordinates?.lon ?? null,
    tags: Array.isArray(p.tags) ? p.tags : [],
    type: Array.isArray(p.tags) && p.tags.length > 0 ? 
      ['nature','historical','cultural'].includes(p.tags[0]?.toLowerCase()) ? p.tags[0].toLowerCase() : null : null
  }));

  return new Response(JSON.stringify({ 
    state, 
    places: placesForFrontend,
    received: places.length, 
    inserted, 
    failed: failures.slice(0, 5), 
    fromCache 
  }), { headers: { 'content-type': 'application/json', ...corsHeaders } });
});


