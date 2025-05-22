import type { CamelKeys, ReplaceKeys } from 'string-ts'

import { camelKeys, replaceKeys } from 'string-ts'
import { z } from 'zod'

function makeTypedEnv<T>(schema: (v: unknown) => T) {
  let cache: CamelKeys<ReplaceKeys<T, 'VITE_', ''>>

  return (args: Record<string, unknown>) => {
    if (!cache) {
      cache = camelKeys(replaceKeys(schema({ ...args }), 'VITE_', ''))
    }
    return cache
  }
}

const envSchema = z.object({
  MODE: z.enum(['development', 'test', 'production']).default('development'),
  VITE_POKEDEX_API_BASE_URL: z.string().url()
})

const getEnv = makeTypedEnv(envSchema.parse.bind(envSchema))

type AppEnv = ReturnType<typeof getEnv>

export { envSchema, getEnv, makeTypedEnv }
export type { AppEnv }
