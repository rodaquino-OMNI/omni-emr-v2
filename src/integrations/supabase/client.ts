
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wpmjvgvmjqffxpxtrlnb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbWp2Z3ZtanFmZnhweHRybG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MDY2MDMsImV4cCI6MjA1NzM4MjYwM30.ADGE65CFoI9a4nVWn55RvPMfC5PfQfBLZmfwQSdRkmY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
