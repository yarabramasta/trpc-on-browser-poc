import { createTRPCRouter, publicProcedure } from '../trpc'
import { pokemonRouter } from './pokemon'

export const appRouter = createTRPCRouter({
  ping: publicProcedure.query(() => 'PONG!!!'),
  pokemon: pokemonRouter
})

export type AppRouter = typeof appRouter
