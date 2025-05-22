import type { TRPCRouterRecord } from '@trpc/server'

import { match } from 'ts-pattern'
import { z } from 'zod'

import { handleAxiosError } from '~/api/axios'

import type { Pokemon } from './dto'
import type { GetPokemonByIdResponse, GetPokemonResponse } from './types'

import { publicProcedure } from '../../trpc'

export const pokemonRouter = {
  getBatch: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.number().min(0).default(0)
      })
    )
    .query(async ({ input: { limit, cursor: offset }, ctx: { api } }) => {
      try {
        const { data: pokemon } = await api.pokedex.get<GetPokemonResponse>(
          '/pokemon',
          { params: { limit, offset } }
        )

        const details: (GetPokemonByIdResponse & { pokemon: string })[] =
          await Promise.all(
            pokemon.results.map(({ url }) =>
              api.pokedex
                .get<GetPokemonByIdResponse>(url)
                .then(({ data }) => ({ ...data, pokemon: url }))
                .catch(() => null)
            )
          ).then(arr => arr.filter(item => item !== null))

        const results = pokemon.results.map(
          res =>
            ({
              name: res.name,
              abilities:
                details
                  .find(({ pokemon }) => pokemon === res.url)
                  ?.abilities.map(({ ability, is_hidden }) => ({
                    name: ability.name,
                    hidden: is_hidden
                  })) ?? [],
              types:
                details
                  .find(({ pokemon }) => pokemon === res.url)
                  ?.types.map(({ type }) => type.name) ?? []
            }) satisfies Pokemon
        )

        return {
          items: results,
          next: getOffsetFromUrl(pokemon.next),
          previous: getOffsetFromUrl(pokemon.previous)
        }
      } catch (e) {
        throw handleAxiosError(e)
      }
    })
} satisfies TRPCRouterRecord

function getOffsetFromUrl(url: string | null) {
  return match(url)
    .with(null, () => undefined)
    .when(
      url => url.includes('offset'),
      url => Number(url.split('offset=')[1].split('&')[0])
    )
    .otherwise(() => undefined)
}
