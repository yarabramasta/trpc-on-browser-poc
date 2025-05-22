import { z } from 'zod'

function makeTypedEnv<T>(schema: (v: unknown) => T) {
  return (args: Record<string, unknown>) => {
    const env = schema({ ...args }) as Record<string, unknown>

    const envWithoutPrefix = Object.fromEntries(
      Object.entries(env).map(([key, value]) => {
        if (key.startsWith('VITE_')) {
          return [key.replace('VITE_', ''), value]
        }
        return [key, value]
      })
    )

    return envWithoutPrefix as {
      [K in keyof T as K extends `VITE_${infer Rest}` ? Rest : K]: T[K]
    }
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
