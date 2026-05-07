// Cache management utilities for the Smart Tourist application
// This script helps manage the caching system

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to clean up expired cache entries
async function cleanupExpiredCache() {
  console.log('Cleaning up expired cache entries...');
  
  try {
    // Clean up expired festivals cache
    const { data: festivalsDeleted, error: festivalsError } = await supabase
      .from('festivals_cache')
      .delete()
      .lt('expires_at', new Date().toISOString());
    
    if (festivalsError) {
      console.error('Error cleaning festivals cache:', festivalsError);
    } else {
      console.log(`Cleaned up ${festivalsDeleted?.length || 0} expired festival cache entries`);
    }

    // Clean up expired chat cache
    const { data: chatDeleted, error: chatError } = await supabase
      .from('chat_cache')
      .delete()
      .lt('expires_at', new Date().toISOString());
    
    if (chatError) {
      console.error('Error cleaning chat cache:', chatError);
    } else {
      console.log(`Cleaned up ${chatDeleted?.length || 0} expired chat cache entries`);
    }

    // Clean up old places cache (older than 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: placesUpdated, error: placesError } = await supabase
      .from('places')
      .update({ gemini_cache_json: null, gemini_cached_at: null })
      .lt('gemini_cached_at', thirtyDaysAgo);
    
    if (placesError) {
      console.error('Error cleaning places cache:', placesError);
    } else {
      console.log(`Cleaned up ${placesUpdated?.length || 0} old places cache entries`);
    }

    console.log('Cache cleanup completed successfully!');
  } catch (error) {
    console.error('Error during cache cleanup:', error);
  }
}

// Function to get cache statistics
async function getCacheStats() {
  console.log('Cache Statistics:');
  
  try {
    // Festivals cache stats
    const { count: festivalsCount } = await supabase
      .from('festivals_cache')
      .select('*', { count: 'exact', head: true });
    
    console.log(`Festivals cache entries: ${festivalsCount}`);

    // Chat cache stats
    const { count: chatCount } = await supabase
      .from('chat_cache')
      .select('*', { count: 'exact', head: true });
    
    console.log(`Chat cache entries: ${chatCount}`);

    // Places with cache stats
    const { count: placesWithCache } = await supabase
      .from('places')
      .select('*', { count: 'exact', head: true })
      .not('gemini_cache_json', 'is', null);
    
    console.log(`Places with cached data: ${placesWithCache}`);

  } catch (error) {
    console.error('Error getting cache stats:', error);
  }
}

// Function to clear all cache
async function clearAllCache() {
  console.log('Clearing all cache...');
  
  try {
    // Clear festivals cache
    await supabase.from('festivals_cache').delete().neq('cache_id', '00000000-0000-0000-0000-000000000000');
    
    // Clear chat cache
    await supabase.from('chat_cache').delete().neq('cache_id', '00000000-0000-0000-0000-000000000000');
    
    // Clear places cache
    await supabase.from('places').update({ 
      gemini_cache_json: null, 
      gemini_cached_at: null 
    }).neq('place_id', '00000000-0000-0000-0000-000000000000');
    
    console.log('All cache cleared successfully!');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'cleanup':
    cleanupExpiredCache();
    break;
  case 'stats':
    getCacheStats();
    break;
  case 'clear':
    clearAllCache();
    break;
  default:
    console.log(`
Cache Management Utility

Usage: node cache_management.js <command>

Commands:
  cleanup  - Remove expired cache entries
  stats    - Show cache statistics
  clear    - Clear all cache (use with caution)

Examples:
  node cache_management.js cleanup
  node cache_management.js stats
  node cache_management.js clear
    `);
}
