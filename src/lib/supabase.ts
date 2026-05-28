/// <reference types="vite/client" />
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  throw new Error("[supabase] VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY fehlen in .env!");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
