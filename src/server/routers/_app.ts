import { router } from '../trpc';
import { conversationRouter } from './conversation';
import { messageRouter } from './message';
import { openrouterRouter } from './openrouter';

export const appRouter = router({
  conversation: conversationRouter,
  message: messageRouter,
  openrouter: openrouterRouter, // add this line
});

export type AppRouter = typeof appRouter;
