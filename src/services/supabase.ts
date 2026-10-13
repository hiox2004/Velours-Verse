import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rlszobetjgwxifueqmyr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsc3pvYmV0amd3eGlmdWVxbXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5MDk1NTYsImV4cCI6MjEwNzQ4NTU1Nn0.wcJZt5bHDQkOyvAhuPYA5iX2_vm_d4n60VF3v3WNR04';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
