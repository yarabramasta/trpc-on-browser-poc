import { capitalize } from 'string-ts'
import { z } from 'zod'

const pokemonSchema = z.object({
  name: z.string().transform(val => capitalize(val).toString()),
  abilities: z.array(
    z.object({
      name: z.string().transform(val => capitalize(val).toString()),
      hidden: z.boolean().default(false)
    })
  ),
  types: z.array(z.string().transform(val => capitalize(val).toString()))
})

type Pokemon = z.infer<typeof pokemonSchema>

export { pokemonSchema }
export type { Pokemon }
