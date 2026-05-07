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

async function callGemini(placeName: string, state: string) {
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing');
  const prompt = `
You are an expert travel writer and itinerary planner specializing in Indian tourism. Create comprehensive travel information for "${placeName}" in "${state}".

Provide ONLY valid JSON with these fields:
{
  "name": string,
  "long_desc": string (detailed 200+ word description),
  "history_summary": string (100+ words about historical significance),
  "visiting_tips": string[] (8-10 practical tips),
  "best_time_to_visit": string (detailed seasonal advice),
  "safety_notes": string[] (6-8 safety considerations),
  "local_cuisine": string[] (5-7 local dishes to try),
  "nearby_attractions": string[] (5-7 nearby places),
  "cultural_significance": string (100+ words about cultural importance),
  "photography_spots": string[] (5-7 best photo locations),
  "suggested_itinerary_snippet": [{"time": string, "activity": string}] (6-8 activities),
  "detailed_itinerary": [
    { "day": 1, "summary": string, "activities": [ { "time": string, "title": string, "details": string, "transport": string, "difficulty": "easy"|"moderate"|"hard" } ] },
    { "day": 2, "summary": string, "activities": [ { "time": string, "title": string, "details": string, "transport": string, "difficulty": "easy"|"moderate"|"hard" } ] },
    { "day": 3, "summary": string, "activities": [ { "time": string, "title": string, "details": string, "transport": string, "difficulty": "easy"|"moderate"|"hard" } ] }
  ],
  "budget_estimates": {
    "budget": {"accommodation": string, "food": string, "transport": string, "activities": string},
    "mid_range": {"accommodation": string, "food": string, "transport": string, "activities": string},
    "luxury": {"accommodation": string, "food": string, "transport": string, "activities": string}
  },
  "transportation_options": string[] (5-7 ways to reach),
  "accommodation_suggestions": string[] (5-7 types of stays),
  "local_festivals": string[] (3-5 festivals/events),
  "shopping_recommendations": string[] (5-7 items to buy)
}

Requirements:
- Make content rich, detailed, and practical
- Include specific local information and insider tips
- Provide comprehensive 3-day itinerary with 4+ activities per day
- Include budget estimates for different traveler types
- Focus on authentic local experiences
- JSON only, no markdown or backticks`;
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 3000 } })
  });
  if (!res.ok) throw new Error('Gemini request failed: ' + (await res.text()));
  const data = await res.json();
  let text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
  const fence = text.match(/```json[\s\S]*?```/i) || text.match(/```[\s\S]*?```/);
  if (fence && fence[0]) text = fence[0].replace(/```json|```/gi, '').trim();
  try { return JSON.parse(text); } catch { return {}; }
}

serve(async (req) => {
  const origin = req.headers.get('Origin');
  const cors = makeCorsHeaders(origin);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: { ...cors } });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { ...cors } });
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return new Response('Server not configured', { status: 500, headers: { ...cors } });
  const { place_id, state } = await req.json().catch(() => ({}));
  if (!place_id) return new Response('place_id required', { status: 400, headers: { ...cors } });

  const pr = await fetch(`${url}/rest/v1/places?place_id=eq.${place_id}&select=name,state,long_desc,images,lat,lon`, {
    headers: { 'Authorization': `Bearer ${key}`, 'apiKey': key }
  });
  const arr = await pr.json();
  const place = arr?.[0];
  if (!place) return new Response('Not found', { status: 404, headers: { ...cors } });

  let gemini: any = {};
  let fromCache = false;
  
  // Check if we have cached detailed information (within last 7 days)
  const cacheThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const cachedDetail = await fetch(`${url}/rest/v1/places?place_id=eq.${place_id}&gemini_cached_at=gte.${cacheThreshold}&select=gemini_cache_json,long_desc`, {
    headers: { 'Authorization': `Bearer ${key}`, 'apiKey': key }
  });
  
  if (cachedDetail.ok) {
    const cachedData = await cachedDetail.json();
    console.log('[place-detail] checking cache for place_id:', place_id);
    
    if (cachedData && cachedData[0] && cachedData[0].gemini_cache_json) {
      // Validate cached content has required fields
      const cachedGemini = cachedData[0].gemini_cache_json;
      if (cachedGemini.name && cachedGemini.long_desc && cachedGemini.detailed_itinerary) {
        gemini = cachedGemini;
        fromCache = true;
        console.log('[place-detail] using cached detailed info for:', place.name);
      } else {
        console.log('[place-detail] cached data incomplete, will call Gemini');
      }
    } else {
      console.log('[place-detail] no cached data found, will call Gemini');
    }
  }
  
  // If no valid cached detail, call Gemini
  if (!fromCache) {
    console.log('[place-detail] calling Gemini API for:', place.name);
    gemini = await callGemini(place.name, place.state || state || '');
    
    // Store the comprehensive detailed information in cache
    const upd = await fetch(`${url}/rest/v1/places?place_id=eq.${place_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}`, 'apiKey': key },
      body: JSON.stringify({ 
        long_desc: gemini.long_desc || place.long_desc,
        gemini_cache_json: gemini,
        gemini_cached_at: new Date().toISOString()
      })
    });
    if (upd.ok) {
      place.long_desc = gemini.long_desc || place.long_desc;
      console.log('[place-detail] cached comprehensive data for:', place.name);
    }
  } else {
    // Use cached long_desc if available
    if (gemini.long_desc) {
      place.long_desc = gemini.long_desc;
    }
    console.log('[place-detail] serving from cache, skipping Gemini call');
  }

  return new Response(JSON.stringify({ ...place, gemini, fromCache }), { headers: { 'content-type': 'application/json', ...cors } });
});


