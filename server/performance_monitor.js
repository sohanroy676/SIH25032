// Performance monitoring script for Smart Tourist application
// This script helps track response times and cache effectiveness

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to test places-fetch performance
async function testPlacesFetchPerformance(state = 'Jharkhand') {
  console.log(`\n🚀 Testing places-fetch performance for ${state}...`);
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${supabaseUrl.replace('.supabase.co', '.functions.supabase.co')}/places-fetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({ state })
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Response time: ${responseTime}ms`);
      console.log(`📊 Places returned: ${data.places?.length || 0}`);
      console.log(`💾 From cache: ${data.fromCache ? 'Yes ⚡' : 'No 🔄'}`);
      console.log(`📈 Database inserts: ${data.inserted || 0}`);
      
      if (data.fromCache) {
        console.log(`🎉 Cache hit! Response was ${responseTime < 1000 ? 'fast' : 'moderate'} (${responseTime}ms)`);
      } else {
        console.log(`🔄 Cache miss - Gemini API call made (${responseTime}ms)`);
      }
      
      return { responseTime, fromCache: data.fromCache, placesCount: data.places?.length || 0 };
    } else {
      console.error(`❌ Request failed: ${response.status} ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

// Function to test place-detail performance
async function testPlaceDetailPerformance(placeId) {
  console.log(`\n🏛️ Testing place-detail performance for place ${placeId}...`);
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${supabaseUrl.replace('.supabase.co', '.functions.supabase.co')}/place-detail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({ place_id: placeId })
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Response time: ${responseTime}ms`);
      console.log(`💾 From cache: ${data.fromCache ? 'Yes ⚡' : 'No 🔄'}`);
      console.log(`📝 Place: ${data.name}`);
      
      if (data.fromCache) {
        console.log(`🎉 Cache hit! Response was ${responseTime < 500 ? 'very fast' : 'fast'} (${responseTime}ms)`);
      } else {
        console.log(`🔄 Cache miss - Gemini API call made (${responseTime}ms)`);
      }
      
      return { responseTime, fromCache: data.fromCache };
    } else {
      console.error(`❌ Request failed: ${response.status} ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

// Function to get a random place ID for testing
async function getRandomPlaceId() {
  try {
    const { data } = await supabase
      .from('places')
      .select('place_id')
      .limit(1)
      .single();
    
    return data?.place_id;
  } catch (error) {
    console.error('Error getting random place ID:', error);
    return null;
  }
}

// Function to run comprehensive performance tests
async function runPerformanceTests() {
  console.log('🔍 Smart Tourist Performance Monitor');
  console.log('=====================================');
  
  // Test 1: Places fetch (should be cached after first call)
  console.log('\n📋 Test 1: Places Fetch Performance');
  const test1a = await testPlacesFetchPerformance('Jharkhand');
  const test1b = await testPlacesFetchPerformance('Jharkhand'); // Should be cached
  
  // Test 2: Place detail
  console.log('\n📋 Test 2: Place Detail Performance');
  const placeId = await getRandomPlaceId();
  if (placeId) {
    const test2a = await testPlaceDetailPerformance(placeId);
    const test2b = await testPlaceDetailPerformance(placeId); // Should be cached
  }
  
  // Test 3: Different states
  console.log('\n📋 Test 3: Different States Performance');
  await testPlacesFetchPerformance('Kerala');
  await testPlacesFetchPerformance('Rajasthan');
  
  // Summary
  console.log('\n📊 Performance Summary');
  console.log('=====================');
  
  if (test1a && test1b) {
    const improvement = test1a.responseTime - test1b.responseTime;
    const improvementPercent = ((improvement / test1a.responseTime) * 100).toFixed(1);
    console.log(`Places fetch improvement: ${improvement}ms (${improvementPercent}%)`);
  }
  
  console.log('\n💡 Tips for better performance:');
  console.log('- First load will be slower (API calls)');
  console.log('- Subsequent loads should be much faster (cache hits)');
  console.log('- Cache expires after 7 days for places, 1 day for chat');
  console.log('- Use the cache management script to clean up expired entries');
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'places':
    testPlacesFetchPerformance(process.argv[3] || 'Jharkhand');
    break;
  case 'detail':
    const placeId = process.argv[3];
    if (!placeId) {
      console.error('Please provide a place ID: node performance_monitor.js detail <place_id>');
      process.exit(1);
    }
    testPlaceDetailPerformance(placeId);
    break;
  case 'test':
    runPerformanceTests();
    break;
  default:
    console.log(`
Performance Monitor

Usage: node performance_monitor.js <command>

Commands:
  places [state]  - Test places-fetch performance for a state
  detail <id>    - Test place-detail performance for a place ID
  test           - Run comprehensive performance tests

Examples:
  node performance_monitor.js places Jharkhand
  node performance_monitor.js detail 123e4567-e89b-12d3-a456-426614174000
  node performance_monitor.js test
    `);
}
