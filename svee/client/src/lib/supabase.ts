import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
export const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
export const orderKey = import.meta.env.VITE_SUPABASE_ORDER_ANON_KEY || "";
export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
