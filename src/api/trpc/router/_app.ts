import { createTRPCRouter, publicProcedure } from '../trpc'

export const appRouter = createTRPCRouter({
  ping: publicProcedure.query(async ({ ctx: { api } }) => {
    return await api.pokedex.get('/pokemon').then(res => res.data)
  })
})

export type AppRouter = typeof appRouter
