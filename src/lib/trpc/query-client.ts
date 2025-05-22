import { cache } from 'react'

import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'
import SuperJSON from 'superjson'

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
        shouldRedactErrors: () => {
          return false
        }
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize
      }
    }
  })
}

const getQueryClient = cache(createQueryClient)

export { createQueryClient, getQueryClient }
