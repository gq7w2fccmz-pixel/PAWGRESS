import { createClient } from "@supabase/supabase-js";

// ── Platzhalter – ersetze mit deinen Werten aus:
// Supabase Dashboard → Project Settings → API
const SUPABASE_URL  = "https://bkteygggqwlvvzmbopbs.supabase.co";
const SUPABASE_ANON = "sb_publishable_Fh0AT1i7Yz6-fAXSCBpmzg_5AWNp-t5";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
