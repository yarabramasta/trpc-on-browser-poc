import type { QueryClient } from '@tanstack/react-query'

import fontInterWoff2 from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { createTRPCProxy } from '~/lib/trpc/react'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    links: [
      {
        rel: 'preload',
        as: 'font',
        href: fontInterWoff2,
        type: 'font/woff2',
        crossOrigin: 'anonymous'
      }
    ]
  }),
  beforeLoad: () => {
    return {
      trpc: createTRPCProxy()
    }
  },
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
})
