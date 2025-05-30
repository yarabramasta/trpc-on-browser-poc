import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { createRouter, RouterProvider } from '@tanstack/react-router'

import { getTrpcTSRouterContext, TRPCReactProvider } from './lib/trpc/react.tsx'
import reportWebVitals from './reportWebVitals.ts'
import './assets/styles/app.css'
// @ts-expect-error - ...
import '@fontsource-variable/geist'

import { routeTree } from './routeTree.gen.ts'

const router = createRouter({
  routeTree,
  context: {
    ...getTrpcTSRouterContext()
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TRPCReactProvider>
        <RouterProvider router={router} />
      </TRPCReactProvider>
    </StrictMode>
  )
}

reportWebVitals()
