import { router } from '../trpc';
import { conversationRouter } from './conversation';
import { messageRouter } from './message';
import { geminiRouter } from './gemini';

export const appRouter = router({
  conversation: conversationRouter,
  message: messageRouter,
  gemini: geminiRouter, 
});

export type AppRouter = typeof appRouter;
