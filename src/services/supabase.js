import {createClient} from '@supabase/supabase-js';

const SUPABASE_URL = "https://vyeoawsvarrzypfhitnk.supabase.co";
const SUPABASE_KEY = "sb_publishable_VKsx7GXSuiAmKD11M0mTdA_5MzfcjeW";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);