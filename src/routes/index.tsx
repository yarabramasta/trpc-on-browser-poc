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

  const pokemons = data.pages.flatMap(({ items }) => items)

  return (
    <div className="flex h-dvh w-full flex-col overflow-x-hidden">
      <header className="bg-background sticky inset-x-0 top-0 px-4">
        <nav className="relative flex h-16 items-center">
          <button
            type="button"
            onClick={e => {
              e.preventDefault()
              fetchNextPage()
            }}
            disabled={!hasNextPage || isFetchingNextPage}
            className="h-9 border px-3 text-sm font-medium disabled:opacity-50"
          >
            {isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
                ? 'Load More'
                : 'Nothing more to load'}
          </button>
        </nav>
      </header>
      <main className="flex-1">
        <ul className="flex flex-wrap gap-4 p-4">
          {pokemons.map(({ name }) => (
            <li key={`pokemon-${name}`}>{name}</li>
          ))}
        </ul>
      </main>
    </div>
  )
}
