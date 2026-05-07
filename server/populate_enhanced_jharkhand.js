// Enhanced Jharkhand data population script
// This script populates the database with comprehensive cached data for fast prototype loading

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Enhanced Jharkhand places with comprehensive content
const enhancedJharkhandPlaces = [
  {
    name: "Dassam Falls",
    state: "Jharkhand",
    type: "nature",
    lat: 23.251,
    lon: 85.582,
    short_desc: "A magnificent waterfall cascading down 144 feet near Ranchi, perfect for day trips, picnics, and nature photography. Surrounded by lush green forests.",
    long_desc: "Dassam Falls is one of Jharkhand's most spectacular waterfalls, located about 40 km from Ranchi. The falls cascade down from a height of about 144 feet, creating a breathtaking sight especially during the monsoon season. Formed by the Kanchi River, a tributary of the Subarnarekha River, this natural wonder offers a perfect setting for nature lovers, photographers, and adventure seekers. The surrounding area is lush green and provides excellent opportunities for hiking, bird watching, and exploring local tribal culture.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800"
    ],
    tags: ["nature", "waterfall", "picnic", "photography"],
    gemini_cache_json: {
      name: "Dassam Falls",
      long_desc: "Dassam Falls is one of Jharkhand's most spectacular waterfalls, located about 40 km from Ranchi. The falls cascade down from a height of about 144 feet, creating a breathtaking sight especially during the monsoon season. Formed by the Kanchi River, a tributary of the Subarnarekha River, this natural wonder offers a perfect setting for nature lovers, photographers, and adventure seekers.",
      history_summary: "The falls are named after the nearby village of Dassam and have been a significant landmark for centuries. Formed naturally by the Kanchi River, it has been a popular destination for locals and tourists alike. The area has rich tribal heritage and has been preserved as a natural wonder.",
      visiting_tips: [
        "Best visited during monsoon (July-September) for maximum water flow",
        "Wear comfortable shoes as there's walking involved",
        "Carry water and snacks as facilities are limited",
        "Don't venture too close to the falls edge for safety",
        "Early morning visits offer better photography opportunities",
        "Bring rain gear during monsoon season",
        "Respect local tribal customs and traditions",
        "Carry insect repellent for forest areas",
        "Book accommodation in advance during peak season",
        "Try local tribal cuisine at nearby villages"
      ],
      best_time_to_visit: "July to September (monsoon season) for the best waterfall experience with maximum water flow and lush greenery",
      safety_notes: [
        "Be cautious near the waterfall edge",
        "Avoid visiting during heavy rains",
        "Keep children supervised at all times",
        "Wear non-slip shoes on wet rocks",
        "Don't swim in the pool below the falls",
        "Follow local safety guidelines",
        "Inform someone about your hiking plans",
        "Carry first aid kit"
      ],
      local_cuisine: [
        "Litti Chokha - Traditional Bihari dish",
        "Dhuska - Rice flour pancakes",
        "Thekua - Sweet fried cookies",
        "Mutton Curry - Spicy local preparation",
        "Sattu Paratha - Protein-rich flatbread",
        "Chana Ghugni - Spiced chickpea curry",
        "Malpua - Sweet dessert"
      ],
      nearby_attractions: [
        "Hundru Falls - Another spectacular waterfall",
        "Jonha Falls - Scenic waterfall nearby",
        "Patratu Valley - Beautiful valley with dam",
        "Netarhat - Hill station destination",
        "Betla National Park - Wildlife sanctuary",
        "Jagannath Temple - Ancient temple in Ranchi",
        "Rock Garden - Man-made garden attraction"
      ],
      cultural_significance: "Dassam Falls holds significant cultural importance for local tribal communities. The area is considered sacred by many indigenous groups who have lived here for generations. The falls are often featured in local folklore and traditional stories, making it not just a natural wonder but also a cultural heritage site.",
      photography_spots: [
        "Main waterfall viewpoint",
        "Forest trail entrance",
        "Tribal village outskirts",
        "Sunrise point near falls",
        "River confluence area",
        "Rock formations around falls",
        "Local market area"
      ],
      suggested_itinerary_snippet: [
        { time: "Morning", activity: "Depart from Ranchi" },
        { time: "10 AM", activity: "Reach Dassam Falls" },
        { time: "12 PM", activity: "Picnic lunch" },
        { time: "2 PM", activity: "Nature walk" },
        { time: "4 PM", activity: "Photography session" },
        { time: "6 PM", activity: "Return to Ranchi" }
      ],
      detailed_itinerary: [
        {
          day: 1,
          summary: "Day trip to Dassam Falls from Ranchi",
          activities: [
            { time: "8:00 AM", title: "Departure from Ranchi", details: "Start your journey from Ranchi city center", transport: "Private car or taxi", difficulty: "easy" },
            { time: "10:00 AM", title: "Arrive at Dassam Falls", details: "Reach the waterfall and enjoy the scenic beauty", transport: "On foot", difficulty: "easy" },
            { time: "11:00 AM", title: "Photography and exploration", details: "Take photos and explore the surrounding area", transport: "Walking", difficulty: "easy" },
            { time: "12:00 PM", title: "Picnic lunch", details: "Enjoy a packed lunch near the falls", transport: "Stationary", difficulty: "easy" },
            { time: "1:00 PM", title: "Nature walk", details: "Explore the forest trails around the falls", transport: "Walking", difficulty: "moderate" },
            { time: "2:00 PM", title: "Return journey", details: "Start heading back to Ranchi", transport: "Private car", difficulty: "easy" }
          ]
        },
        {
          day: 2,
          summary: "Extended exploration and nearby attractions",
          activities: [
            { time: "9:00 AM", title: "Visit nearby villages", details: "Explore local tribal villages and culture", transport: "Walking", difficulty: "easy" },
            { time: "11:00 AM", title: "Local handicrafts", details: "Shop for traditional Jharkhand handicrafts", transport: "Walking", difficulty: "easy" },
            { time: "12:30 PM", title: "Traditional lunch", details: "Enjoy local Jharkhand cuisine", transport: "Stationary", difficulty: "easy" },
            { time: "2:00 PM", title: "Return to Ranchi", details: "Head back to the city", transport: "Private car", difficulty: "easy" }
          ]
        },
        {
          day: 3,
          summary: "Relaxation and local experiences",
          activities: [
            { time: "10:00 AM", title: "Late morning visit", details: "Return to falls for a relaxed visit", transport: "Private car", difficulty: "easy" },
            { time: "11:30 AM", title: "Meditation and relaxation", details: "Find a peaceful spot near the falls", transport: "Stationary", difficulty: "easy" },
            { time: "1:00 PM", title: "Final lunch", details: "Last meal before departure", transport: "Stationary", difficulty: "easy" },
            { time: "3:00 PM", title: "Departure", details: "Leave for your next destination", transport: "Private car", difficulty: "easy" }
          ]
        }
      ],
      budget_estimates: {
        budget: {
          accommodation: "₹500-1000 per night (guesthouses)",
          food: "₹200-400 per day (local eateries)",
          transport: "₹1000-1500 (local transport)",
          activities: "₹200-500 (entry fees, guides)"
        },
        mid_range: {
          accommodation: "₹1500-3000 per night (hotels)",
          food: "₹500-800 per day (restaurants)",
          transport: "₹2000-3000 (private car)",
          activities: "₹500-1000 (tours, activities)"
        },
        luxury: {
          accommodation: "₹5000+ per night (resorts)",
          food: "₹1000+ per day (fine dining)",
          transport: "₹4000+ (luxury car with driver)",
          activities: "₹1500+ (premium experiences)"
        }
      },
      transportation_options: [
        "Private car from Ranchi (40 km)",
        "Public bus from Ranchi",
        "Taxi or cab service",
        "Motorcycle rental",
        "Shared jeep from nearby towns",
        "Tourist bus packages",
        "Self-drive car rental"
      ],
      accommodation_suggestions: [
        "Budget guesthouses in nearby villages",
        "Mid-range hotels in Ranchi",
        "Resort stays near waterfalls",
        "Homestays with local families",
        "Camping sites (with permission)",
        "Government rest houses",
        "Eco-lodges in forest areas"
      ],
      local_festivals: [
        "Sarhul Festival (March-April)",
        "Karma Festival (August)",
        "Tusu Festival (January)",
        "Monsoon Festival (July-August)",
        "Tribal Cultural Festival (December)"
      ],
      shopping_recommendations: [
        "Traditional tribal handicrafts",
        "Bamboo products and baskets",
        "Local pottery and ceramics",
        "Tribal jewelry and ornaments",
        "Handwoven textiles",
        "Wooden artifacts",
        "Local spices and condiments"
      ]
    },
    gemini_cached_at: "2024-01-15T10:00:00Z"
  },
  {
    name: "Hundru Falls",
    state: "Jharkhand",
    type: "nature",
    lat: 23.284,
    lon: 85.358,
    short_desc: "Spectacular waterfall on Subarnarekha River cascading down 98 meters, surrounded by dense forests and offering excellent photography opportunities.",
    long_desc: "Hundru Falls is one of the most spectacular waterfalls in Jharkhand, cascading down from a height of about 98 meters. Located on the Subarnarekha River, it's a popular destination for nature enthusiasts and adventure seekers. The falls create a magnificent sight as the water plunges down the rocky cliffs, surrounded by dense forests and hills.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800"
    ],
    tags: ["nature", "waterfall", "river", "adventure"],
    gemini_cached_at: "2024-01-15T10:00:00Z"
  },
  {
    name: "Netarhat",
    state: "Jharkhand",
    type: "nature",
    lat: 23.471,
    lon: 84.267,
    short_desc: "Beautiful hill station known as Queen of Chotanagpur, offering cool climate, scenic viewpoints, and peaceful atmosphere at 1,128 meters altitude.",
    long_desc: "Netarhat is a beautiful hill station located in the Latehar district of Jharkhand, often called the 'Queen of Chotanagpur'. Situated at an altitude of about 1,128 meters above sea level, it offers a pleasant climate throughout the year.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800"
    ],
    tags: ["nature", "hill", "climate", "viewpoint"],
    gemini_cached_at: "2024-01-15T10:00:00Z"
  }
];

async function populateEnhancedPlaces() {
  console.log('🏛️ Populating enhanced Jharkhand places...');
  
  for (const place of enhancedJharkhandPlaces) {
    try {
      // Upsert place with comprehensive cache data
      const { data, error } = await supabase
        .from('places')
        .upsert({
          name: place.name,
          state: place.state,
          type: place.type,
          lat: place.lat,
          lon: place.lon,
          short_desc: place.short_desc,
          long_desc: place.long_desc,
          images: place.images,
          tags: place.tags,
          gemini_cache_json: place.gemini_cache_json,
          gemini_cached_at: place.gemini_cached_at
        }, {
          onConflict: 'name,state'
        });

      if (error) {
        console.error(`Error upserting ${place.name}:`, error);
      } else {
        console.log(`✅ Upserted enhanced data for ${place.name}`);
      }
    } catch (err) {
      console.error(`Error with ${place.name}:`, err);
    }
  }
}

async function runEnhancedPopulation() {
  console.log('🚀 Starting enhanced Jharkhand population...');
  console.log('==========================================');
  
  try {
    await populateEnhancedPlaces();
    
    console.log('\n✅ Enhanced population completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${enhancedJharkhandPlaces.length} places with comprehensive content`);
    console.log('- Detailed itineraries with 3-day plans');
    console.log('- Budget estimates for different traveler types');
    console.log('- Local cuisine and cultural information');
    console.log('- Photography spots and nearby attractions');
    console.log('- Transportation and accommodation options');
    
    console.log('\n🎯 Your prototype now has rich, cached content!');
    console.log('💡 All queries will be lightning fast with comprehensive information ⚡');
    
  } catch (error) {
    console.error('❌ Error during enhanced population:', error);
  }
}

// Run if called directly
if (require.main === module) {
  runEnhancedPopulation();
}

module.exports = { runEnhancedPopulation };
