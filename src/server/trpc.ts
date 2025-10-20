import { initTRPC } from "@trpc/server";
import superjson from "superjson";

export type Context = Record<string, never>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const procedure = t.procedure;



