import { QueryClientProvider } from '@tanstack/react-query'

import { getQueryClient } from './react-query'

const queryClient = getQueryClient()

function getTrpcTSRouterContext() {
  return {
    queryClient
  }
}

function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export { getTrpcTSRouterContext, TRPCReactProvider }
