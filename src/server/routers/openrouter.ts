// server/routers/openrouter.ts

import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const openrouterRouter = router({
  generateText: publicProcedure
    .input(z.object({
      prompt: z.string(),
      messages: z.array(z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string(),
      })).optional(),
      model: z.string().optional(), // allow custom model selection
    }))
    .mutation(async ({ input }) => {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) throw new Error('Missing OpenRouter API Key');

      const model = input.model || 'meta-llama/llama-3-8b-instruct';

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: input.messages || [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: input.prompt }
          ]
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      return { text: data.choices?.[0]?.message?.content ?? '' };
    }),
});
