import { cache, useState } from 'react'

import type { QueryClient } from '@tanstack/react-query'
import type { TRPCQueryOptions } from '@trpc/tanstack-react-query'

import {
  dehydrate,
  HydrationBoundary,
  QueryClientProvider
} from '@tanstack/react-query'
import { createTRPCClient } from '@trpc/client'
import {
  createTRPCContext,
  createTRPCOptionsProxy
} from '@trpc/tanstack-react-query'

import type { AppRouter } from '~/api/trpc'

import {
  appRouter,
  createTRPCContext as createTRPCServerContext
} from '~/api/trpc'
import { localLink } from '~/api/trpc/utils'

import { getQueryClient } from './query-client'

const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>()

const queryClient = getQueryClient()

function getTrpcTSRouterContext() {
  return {
    queryClient
  }
}

function makeTRPCClient() {
  const ctx = createTRPCServerContext()
  return createTRPCClient<AppRouter>({
    links: [
      localLink({
        router: appRouter,
        ctx
      })
    ]
  })
}

const getTRPCClient = cache(makeTRPCClient)

function createTRPCProxy() {
  const trpcClient = getTRPCClient()
  return createTRPCOptionsProxy<AppRouter>({
    client: trpcClient,
    queryClient
  })
}

function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const [trpcClient] = useState(() => getTRPCClient())

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}

function HydrateClient(props: { children: React.ReactNode }) {
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  )
}

function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
  queryClient?: QueryClient
) {
  const isomorphicQueryClient = queryClient ?? getQueryClient()
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    void isomorphicQueryClient.prefetchInfiniteQuery(queryOptions as any)
  } else {
    void isomorphicQueryClient.prefetchQuery(queryOptions)
  }
}

export {
  createTRPCProxy,
  getTrpcTSRouterContext,
  HydrateClient,
  prefetch,
  TRPCReactProvider,
  useTRPC,
  useTRPCClient
}
