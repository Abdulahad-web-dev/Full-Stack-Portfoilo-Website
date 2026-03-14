import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(
    supabaseUrl || 'https://spgbnjpwwghdbfcrvuml.supabase.co',
    supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZ2JuanB3d2doZGJmY3J2dW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4OTA5MDQsImV4cCI6MjA4ODQ2NjkwNH0.WDSUg0nMGVVkgJ96KLFHFKDqE0bdAbsC0bIf8Q6jEFY',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
    }
);

export default supabase;
