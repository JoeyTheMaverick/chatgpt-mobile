import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';

export const conversationRouter = router({
  list: publicProcedure.query(async () => {
    const { data, error } = await supabase.from('conversations').select('*');
    if (error) throw new Error(error.message);
    return data;
  }),
  create: publicProcedure.input(
    z.object({ title: z.string() })
  ).mutation(async ({ input }) => {
    const { data, error } = await supabase.from('conversations').insert([input]).select();
    if (error) throw new Error(error.message);
    return data?.[0];
  }),
});
