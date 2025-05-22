import { TRPCError } from '@trpc/server'
import Axios from 'axios'
import { buildStorage, setupCache } from 'axios-cache-interceptor'
import { del, get, set } from 'idb-keyval'
import { match } from 'ts-pattern'

import { getEnv } from '../env'

const pokedexApi = Axios.create({
  baseURL: getEnv(import.meta.env).pokedexApiBaseUrl
})

const idbCacheStorage = buildStorage({
  async find(key) {
    const value = await get(key)
    if (!value) return
    return JSON.parse(value)
  },
  async set(key, value) {
    await set(key, JSON.stringify(value))
  },
  async remove(key) {
    await del(key)
  }
})

const cachedPokedexApi = setupCache(pokedexApi, { storage: idbCacheStorage })

const handleAxiosError = (error: unknown): TRPCError => {
  if (Axios.isAxiosError(error)) {
    const { response } = error
    const message: string | undefined =
      response?.data?.message || response?.data?.data?.message

    const code = match<number, TRPCError['code']>(response?.status || 500)
      .with(400, () => 'BAD_REQUEST')
      .with(401, () => 'UNAUTHORIZED')
      .with(403, () => 'FORBIDDEN')
      .with(404, () => 'NOT_FOUND')
      .with(429, () => 'TOO_MANY_REQUESTS')
      .otherwise(() => 'INTERNAL_SERVER_ERROR')

    return new TRPCError({ code, message })
  }

  return new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: (error as Error).message || 'Uh oh! Something went wrong.'
  })
}

const api = {
  pokedex: cachedPokedexApi
}

export { api, handleAxiosError }
