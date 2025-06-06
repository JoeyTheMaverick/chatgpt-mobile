import { inferAsyncReturnType } from '@trpc/server';
import { createClient } from '@supabase/supabase-js';

export async function createTRPCContext() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return { supabase };
}

export type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>;