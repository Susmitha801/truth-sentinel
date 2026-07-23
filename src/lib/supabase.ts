import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gtnernmihxkfkrcfoxuo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_NxAGjAuqCZFlesbaeSWTMQ_tJBQSgfs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
