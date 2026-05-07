// Pre-populate Jharkhand with cached data for prototype demonstration
// This script creates sample cached data to make the prototype fast and impressive

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample Jharkhand places data
const jharkhandPlaces = [
  {
    name: "Dassam Falls",
    short_desc: "A scenic waterfall near Ranchi, popular for day trips and picnics.",
    tags: ["nature", "waterfall", "picnic"],
    likely_coordinates: { lat: 23.251, lon: 85.582 },
    likely_festivals: [
      { name: "Monsoon Festival", dateShort: "Jul-Aug" }
    ],
    confidence_score: 0.9
  },
  {
    name: "Hundru Falls",
    short_desc: "Tall waterfall on the Subarnarekha River with beautiful viewpoints.",
    tags: ["nature", "waterfall", "river"],
    likely_coordinates: { lat: 23.284, lon: 85.358 },
    likely_festivals: [],
    confidence_score: 0.88
  },
  {
    name: "Netarhat",
    short_desc: "Hill station known as the Queen of Chotanagpur with cool climate.",
    tags: ["nature", "hill", "climate"],
    likely_coordinates: { lat: 23.471, lon: 84.267 },
    likely_festivals: [
      { name: "Summer Festival", dateShort: "May-Jun" }
    ],
    confidence_score: 0.86
  },
  {
    name: "Betla National Park",
    short_desc: "Wildlife reserve with elephants, tigers and rich biodiversity.",
    tags: ["nature", "wildlife", "park"],
    likely_coordinates: { lat: 23.847, lon: 84.199 },
    likely_festivals: [],
    confidence_score: 0.84
  },
  {
    name: "Patratu Valley",
    short_desc: "Scenic valley with Patratu Dam and beautiful landscapes.",
    tags: ["nature", "valley", "dam"],
    likely_coordinates: { lat: 23.567, lon: 85.234 },
    likely_festivals: [],
    confidence_score: 0.82
  },
  {
    name: "Jagannath Temple",
    short_desc: "Ancient temple in Ranchi dedicated to Lord Jagannath.",
    tags: ["historical", "temple", "religious"],
    likely_coordinates: { lat: 23.344, lon: 85.309 },
    likely_festivals: [
      { name: "Rath Yatra", dateShort: "Jul" }
    ],
    confidence_score: 0.8
  }
];

// Sample detailed place information
const detailedPlaceData = {
  "Dassam Falls": {
    name: "Dassam Falls",
    long_desc: "Dassam Falls is a magnificent waterfall located about 40 km from Ranchi, the capital of Jharkhand. The falls cascade down from a height of about 144 feet, creating a spectacular sight especially during the monsoon season. The surrounding area is lush green and offers a perfect setting for nature lovers and photographers.",
    history_summary: "The falls are named after the nearby village of Dassam. It's a natural waterfall formed by the Kanchi River, which is a tributary of the Subarnarekha River. The area has been a popular tourist destination for decades.",
    visiting_tips: [
      "Best visited during monsoon (July-September) for maximum water flow",
      "Wear comfortable shoes as there's some walking involved",
      "Carry water and snacks as facilities are limited",
      "Don't venture too close to the falls edge for safety"
    ],
    best_time_to_visit: "July to September (monsoon season) for the best waterfall experience",
    safety_notes: [
      "Be cautious near the waterfall edge",
      "Avoid visiting during heavy rains",
      "Keep children supervised at all times"
    ],
    suggested_itinerary_snippet: [
      { time: "Morning", activity: "Depart from Ranchi" },
      { time: "10 AM", activity: "Reach Dassam Falls" },
      { time: "12 PM", activity: "Picnic lunch" },
      { time: "2 PM", activity: "Return to Ranchi" }
    ],
    detailed_itinerary: [
      {
        day: 1,
        summary: "Day trip to Dassam Falls from Ranchi",
        activities: [
          { time: "8:00 AM", title: "Departure from Ranchi", details: "Start your journey from Ranchi city center", transport: "Private car or taxi", difficulty: "easy" },
          { time: "10:00 AM", title: "Arrive at Dassam Falls", details: "Reach the waterfall and enjoy the scenic beauty", transport: "On foot", difficulty: "easy" },
          { time: "11:00 AM", title: "Photography and exploration", details: "Take photos and explore the surrounding area", transport: "Walking", difficulty: "easy" },
          { time: "12:00 PM", title: "Picnic lunch", details: "Enjoy a packed lunch near the falls", transport: "Stationary", difficulty: "easy" }
        ]
      }
    ]
  },
  "Hundru Falls": {
    name: "Hundru Falls",
    long_desc: "Hundru Falls is one of the most spectacular waterfalls in Jharkhand, cascading down from a height of about 98 meters. Located on the Subarnarekha River, it's a popular destination for nature enthusiasts and adventure seekers.",
    history_summary: "The falls are formed by the Subarnarekha River as it flows through the Ranchi plateau. The name 'Hundru' comes from the local tribal language.",
    visiting_tips: [
      "Visit during monsoon for the best water flow",
      "Carry rain gear during monsoon season",
      "Wear non-slip shoes for safety",
      "Bring camera for amazing photo opportunities"
    ],
    best_time_to_visit: "July to October for optimal waterfall experience",
    safety_notes: [
      "Stay away from the edge of the falls",
      "Be careful on wet rocks",
      "Follow safety guidelines"
    ],
    suggested_itinerary_snippet: [
      { time: "Morning", activity: "Travel to Hundru Falls" },
      { time: "10 AM", activity: "Explore the waterfall" },
      { time: "12 PM", activity: "Lunch break" },
      { time: "2 PM", activity: "Return journey" }
    ],
    detailed_itinerary: [
      {
        day: 1,
        summary: "Full day exploration of Hundru Falls",
        activities: [
          { time: "7:00 AM", title: "Early departure", details: "Leave early to avoid crowds", transport: "Private vehicle", difficulty: "easy" },
          { time: "9:00 AM", title: "Arrive at Hundru Falls", details: "Reach the waterfall location", transport: "Walking", difficulty: "easy" },
          { time: "10:00 AM", title: "Waterfall viewing", details: "Enjoy the spectacular waterfall", transport: "Stationary", difficulty: "easy" },
          { time: "11:00 AM", title: "Nature walk", details: "Explore the surrounding forest area", transport: "Walking", difficulty: "moderate" }
        ]
      }
    ]
  }
};

// Sample festivals data
const jharkhandFestivals = [
  {
    name: "Sarhul Festival",
    datePattern: "March-April",
    short_desc: "Spring festival celebrated by tribal communities",
    significance: "Celebrates the blooming of Sal trees and marks the beginning of the agricultural season",
    recommended_attire_or_conduct: "Traditional tribal attire, respectful behavior towards local customs",
    media_links: []
  },
  {
    name: "Karma Festival",
    datePattern: "August",
    short_desc: "Agricultural festival celebrating nature and farming",
    significance: "Honors the Karma tree and celebrates agricultural prosperity",
    recommended_attire_or_conduct: "Traditional dress, participate in folk dances",
    media_links: []
  },
  {
    name: "Tusu Festival",
    datePattern: "January",
    short_desc: "Harvest festival celebrated by Santhal tribe",
    significance: "Celebrates the harvest season and thanks nature for abundance",
    recommended_attire_or_conduct: "Traditional Santhal attire, join in community celebrations",
    media_links: []
  }
];

async function prepopulatePlaces() {
  console.log('🏛️ Pre-populating Jharkhand places...');
  
  for (const place of jharkhandPlaces) {
    try {
      // Upsert place with cache data
      const { data, error } = await supabase
        .from('places')
        .upsert({
          name: place.name,
          state: 'Jharkhand',
          type: place.tags[0] || 'nature',
          lat: place.likely_coordinates?.lat,
          lon: place.likely_coordinates?.lon,
          short_desc: place.short_desc,
          images: [],
          tags: place.tags,
          gemini_cache_json: place,
          gemini_cached_at: new Date().toISOString()
        }, {
          onConflict: 'name,state'
        });

      if (error) {
        console.error(`Error upserting ${place.name}:`, error);
      } else {
        console.log(`✅ Upserted ${place.name}`);
      }
    } catch (err) {
      console.error(`Error with ${place.name}:`, err);
    }
  }
}

async function prepopulateDetailedPlaces() {
  console.log('📝 Pre-populating detailed place information...');
  
  for (const [placeName, details] of Object.entries(detailedPlaceData)) {
    try {
      // Get the place ID first
      const { data: placeData } = await supabase
        .from('places')
        .select('place_id')
        .eq('name', placeName)
        .eq('state', 'Jharkhand')
        .single();

      if (placeData) {
        // Update with detailed information
        const { error } = await supabase
          .from('places')
          .update({
            long_desc: details.long_desc,
            gemini_cache_json: details,
            gemini_cached_at: new Date().toISOString()
          })
          .eq('place_id', placeData.place_id);

        if (error) {
          console.error(`Error updating details for ${placeName}:`, error);
        } else {
          console.log(`✅ Updated detailed info for ${placeName}`);
        }
      }
    } catch (err) {
      console.error(`Error with ${placeName}:`, err);
    }
  }
}

async function prepopulateFestivals() {
  console.log('🎉 Pre-populating Jharkhand festivals...');
  
  for (const festival of jharkhandFestivals) {
    try {
      const { error } = await supabase
        .from('festivals')
        .upsert({
          state: 'Jharkhand',
          short_desc: festival.short_desc,
          long_desc: festival.significance,
          date_pattern: festival.datePattern,
          video_360_link: null
        }, {
          onConflict: 'state,short_desc'
        });

      if (error) {
        console.error(`Error upserting festival ${festival.name}:`, error);
      } else {
        console.log(`✅ Upserted festival ${festival.name}`);
      }
    } catch (err) {
      console.error(`Error with festival ${festival.name}:`, err);
    }
  }
}

async function prepopulateFestivalsCache() {
  console.log('💾 Pre-populating festivals cache...');
  
  try {
    const { error } = await supabase
      .from('festivals_cache')
      .upsert({
        state: 'Jharkhand',
        gemini_response: jharkhandFestivals,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }, {
        onConflict: 'state'
      });

    if (error) {
      console.error('Error upserting festivals cache:', error);
    } else {
      console.log('✅ Upserted festivals cache');
    }
  } catch (err) {
    console.error('Error with festivals cache:', err);
  }
}

async function prepopulateChatCache() {
  console.log('💬 Pre-populating common chat responses...');
  
  const commonChatPrompts = [
    {
      prompt: "What are the best places to visit in Jharkhand?",
      response: "Jharkhand offers amazing destinations! Here are the top places to visit:\n\n1. **Dassam Falls** - A beautiful waterfall near Ranchi, perfect for day trips\n2. **Hundru Falls** - Spectacular waterfall on Subarnarekha River\n3. **Netarhat** - Known as Queen of Chotanagpur, a cool hill station\n4. **Betla National Park** - Wildlife reserve with elephants and tigers\n5. **Patratu Valley** - Scenic valley with dam and landscapes\n6. **Jagannath Temple** - Ancient temple in Ranchi\n\nBest time to visit is during monsoon (July-September) for waterfalls, or winter (November-February) for comfortable weather.",
      language: null
    },
    {
      prompt: "Tell me about Jharkhand tourism",
      response: "Jharkhand is a beautiful state in eastern India known for its natural beauty, waterfalls, and tribal culture. Here's what makes it special:\n\n**Natural Attractions:**\n- Multiple stunning waterfalls (Dassam, Hundru, Jonha)\n- Hill stations like Netarhat\n- National parks and wildlife sanctuaries\n- Scenic valleys and dams\n\n**Cultural Heritage:**\n- Rich tribal traditions and festivals\n- Ancient temples and historical sites\n- Traditional handicrafts and art\n\n**Best Time to Visit:**\n- Monsoon (July-September) for waterfalls\n- Winter (November-February) for pleasant weather\n- Spring (March-April) for festivals\n\n**Access:**\n- Well connected by road and rail\n- Ranchi is the main hub\n- Domestic flights available",
      language: null
    }
  ];

  for (const chat of commonChatPrompts) {
    try {
      // Generate hash for the prompt
      const crypto = require('crypto');
      const promptHash = crypto.createHash('sha256').update(chat.prompt.toLowerCase().trim()).digest('hex');
      
      const { error } = await supabase
        .from('chat_cache')
        .upsert({
          prompt_hash: promptHash,
          prompt: chat.prompt,
          response: chat.response,
          language: chat.language,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }, {
          onConflict: 'prompt_hash'
        });

      if (error) {
        console.error(`Error upserting chat cache for "${chat.prompt}":`, error);
      } else {
        console.log(`✅ Upserted chat cache for "${chat.prompt.substring(0, 30)}..."`);
      }
    } catch (err) {
      console.error(`Error with chat cache:`, err);
    }
  }
}

async function runPrepopulation() {
  console.log('🚀 Starting Jharkhand pre-population for prototype...');
  console.log('================================================');
  
  try {
    await prepopulatePlaces();
    await prepopulateDetailedPlaces();
    await prepopulateFestivals();
    await prepopulateFestivalsCache();
    await prepopulateChatCache();
    
    console.log('\n✅ Pre-population completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${jharkhandPlaces.length} places cached`);
    console.log(`- ${Object.keys(detailedPlaceData).length} detailed place descriptions`);
    console.log(`- ${jharkhandFestivals.length} festivals cached`);
    console.log(`- ${2} common chat responses cached`);
    
    console.log('\n🎯 Your prototype is now ready with cached data!');
    console.log('💡 All Jharkhand queries should now be lightning fast ⚡');
    
  } catch (error) {
    console.error('❌ Error during pre-population:', error);
  }
}

// Run if called directly
if (require.main === module) {
  runPrepopulation();
}

module.exports = { runPrepopulation };
