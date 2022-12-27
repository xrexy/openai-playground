import { router } from "../trpc";
import { authRouter } from "./auth";
import { openaiRouter } from "./openai";

export const appRouter = router({
  auth: authRouter,
  openai: openaiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
