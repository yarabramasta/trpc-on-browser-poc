import { useMemo } from 'react'

import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import type { RouterOutputs } from '~/api/trpc'

import { HydrateClient, prefetch, useTRPC } from '~/lib/trpc/react'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context: { queryClient, trpc } }) => {
    prefetch(trpc.pokemon.getBatch.queryOptions({}), queryClient)
  },
  component: RouteComponent,
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: ({ error, reset }) => (
    <div>
      <button type="button" onClick={reset}>
        Try again
      </button>
      <p>{error.message}</p>
    </div>
  )
})

function RouteComponent() {
  return (
    <HydrateClient>
      <PokemonData />
    </HydrateClient>
  )
}

function PokemonData() {
  const trpc = useTRPC()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery<RouterOutputs['pokemon']['getBatch']>(
      trpc.pokemon.getBatch.infiniteQueryOptions(
        {},
        {
          getNextPageParam: (lastPage, _pages) => lastPage.next
        }
      ) as any
    )

  const flatten = useMemo(
    () => data.pages.flatMap(({ items }) => items),
    [data]
  )

  return (
    <div>
      {flatten.map(({ name }) => (
        <pre key={`pokemon-${name}`}>{name}</pre>
      ))}
    </div>
  )
}
