

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Supabase Project URL and Anon Key
const supabaseUrl = 'https://adqmsvilzisqwttkpzww.supabase.co'
const supabaseKey = 'eyJhbGciOiJIU9sZSI6ImFub24iLCJpYXQiOjE3Nzc4Mjk0MzIsImV4cCI6MjA5MzQwNTQzMn0.RLeuxuloss2NtcjvusTFel_7aLS_yE'
export const supabase = createClient(supabaseUrl, supabaseKey);

