import { Suspense } from 'react'

import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { HydrateClient, prefetch, useTRPC } from '~/lib/trpc/react'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context: { queryClient, trpc } }) => {
    prefetch(trpc.ping.queryOptions(), queryClient)
  },
  component: RouteComponent
})

function RouteComponent() {
  return (
    <HydrateClient>
      <Suspense fallback={<div>Loading...</div>}>
        <PokemonData />
      </Suspense>
    </HydrateClient>
  )
}

function PokemonData() {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.ping.queryOptions())

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
