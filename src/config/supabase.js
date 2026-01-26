const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Please add SUPABASE_URL and SUPABASE_SERVICE_KEY to your .env file');
  console.error('Current values:');
  console.error('  SUPABASE_URL:', supabaseUrl ? 'Set ✓' : 'Missing ✗');
  console.error('  SUPABASE_SERVICE_KEY:', supabaseServiceKey ? 'Set ✓' : 'Missing ✗');
  throw new Error('Missing Supabase credentials');
}

// Create a single supabase client for the backend
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test connection
const connectDB = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count');
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is okay
      console.error('❌ Supabase connection test failed:', error.message);
      console.error('Full error:', error);
      throw new Error(`Supabase connection failed: ${error.message}`);
    } else {
      console.log('✅ Supabase connected successfully!');
    }
  } catch (err) {
    console.error('❌ Supabase connection error:', err.message);
    throw err;
  }
};

module.exports = { supabase, connectDB };
