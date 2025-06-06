import { publicProcedure, router } from '../trpc';
import { z } from 'zod';

export const geminiRouter = router({
  generateText: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: input.prompt }] }]
        }),
      });
      const data = await res.json();
      return { text: data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response.' };
    }),

  generateImage: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=' + process.env.GEMINI_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: input.prompt }] }]
        }),
      });
      const data = await res.json();
      // Adjust this according to Gemini's actual response format for images
      return { imageUrl: data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? null };
    }),
});
