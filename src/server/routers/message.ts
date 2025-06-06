import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';

export const messageRouter = router({
  list: publicProcedure.input(
    z.object({ conversation_id: z.string() })
  ).query(async ({ input }) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', input.conversation_id)
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  }),
  create: publicProcedure.input(
    z.object({
      conversation_id: z.string(),
      content: z.string(),
    })
  ).mutation(async ({ input }) => {
    const { data, error } = await supabase.from('messages').insert([input]).select();
    if (error) throw new Error(error.message);
    return data?.[0];
  }),
});
