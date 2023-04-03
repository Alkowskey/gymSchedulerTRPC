import { initTRPC } from "@trpc/server";
import { z } from 'zod';
import { registerHandler } from "../controllers/auth.controller";
import Exercise from "../models/exercise";
import { createUserSchema } from "../schema/user.schema";
import { collections } from "../services/database.service";

const t = initTRPC.create();

const router = t.router;
const publicProcedure = t.procedure;

export type AppRouter = typeof mainRouter;

export const mainRouter = router({
    greeting: publicProcedure
      .input(
        z
          .object({
            name: z.string().nullish(),
          })
          .nullish(),
      )
      .query(({ input }) => {
        return {
          text: `${input?.name ?? 'world'}`,
          greeting: 'Hi'
        };
      }),
    registerUser: publicProcedure.input(createUserSchema).mutation(({ input }) => {
      registerHandler({ input });
    }),
    exercise: publicProcedure.query(async (): Promise<Exercise[]> => {
        const exercise = await collections.exercises?.find({}).toArray() as unknown as Exercise[]; // TODO - fix that type casting
        if(!exercise?.length) throw new Error("Exercise not found");
        return exercise;
      }),
  });