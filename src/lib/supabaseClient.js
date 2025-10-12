// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Récupérez ces valeurs depuis votre dashboard Supabase
// Pour l'environnement de développement, vous pouvez les mettre dans un fichier .env
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://wrfpackfdwsopqvelshy.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZnBhY2tmZHdzb3BxdmVsc2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMDI1NDMsImV4cCI6MjA3NTY3ODU0M30.aEyoUWgFk0KMMymNHChTmuPSJUP92wn18uRw2dboc-Y';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Variables Supabase manquantes. Assurez-vous que REACT_APP_SUPABASE_URL et REACT_APP_SUPABASE_ANON_KEY sont définies dans votre fichier .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});