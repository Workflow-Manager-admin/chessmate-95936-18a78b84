import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://qnshkxvkrrstpxeveuiy.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuc2hreHZrcnJzdHB4ZXZldWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTAwOTEsImV4cCI6MjA2Njg2NjA5MX0.uqYnsVvvvA2xUUcToy716ztkOvwT1AS-8EY2JGUVYm0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
