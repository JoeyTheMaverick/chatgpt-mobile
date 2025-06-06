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
    console.log('message.create input:', input);
    const { data, error } = await supabase.from('messages').insert([input]).select();
    console.log('Supabase insert result:', { data, error });
    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(error.message);
    }
    
    console.log('Inserted message:', data?.[0]);

    return data?.[0];
  }),
});
