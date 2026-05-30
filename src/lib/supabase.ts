/// <reference types="vite/client" />
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = (import.meta as any).env ?? {};
const SUPABASE_URL  = env.VITE_SUPABASE_URL  as string | undefined;
const SUPABASE_ANON = env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True wenn Supabase korrekt konfiguriert ist */
export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON);

if (!isSupabaseConfigured) {
  console.error(
    "[Pawgress] Supabase ENV-Variablen fehlen.\n" +
    "Bitte VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY in .env setzen.\n" +
    "App läuft im lokalen Offline-Modus — kein Sync, keine Auth."
  );
}

// Fix: createClient<Database> — Tabellentypen bekannt, kein "never"-Inferenzproblem mehr
// Fix #7: Nur echter Client wenn konfiguriert
export const supabase = createClient<Database>(
  SUPABASE_URL  ?? "https://placeholder.supabase.co",
  SUPABASE_ANON ?? "placeholder-anon-key",
  {
    auth: {
      persistSession:     isSupabaseConfigured,
      autoRefreshToken:   isSupabaseConfigured,
      detectSessionInUrl: isSupabaseConfigured,
    },
  }
);
