import type { OperationResultEnvelope, TRPCLink } from '@trpc/client'
import type { AnyTRPCRouter } from '@trpc/server'

import { TRPCClientError } from '@trpc/client'
import { observable } from '@trpc/server/observable'

/**
 * Can be used to call a router directly using tRPC caller factory.
 */
export function localLink<TRouter extends AnyTRPCRouter, Ctx = unknown>({
  router,
  ctx
}: {
  router: TRouter
  ctx?: Ctx
}): TRPCLink<TRouter> {
  return () => {
    return ({ op }) => {
      return observable<
        OperationResultEnvelope<unknown, TRPCClientError<TRouter>>,
        TRPCClientError<TRouter>
      >(observer => {
        async function execute() {
          const caller = router.createCaller(ctx ?? ({} as Ctx))
          try {
            const data = await (caller[op.path] as (input: unknown) => unknown)(
              op.input
            )
            observer.next({ result: { data, type: 'data' } })
            observer.complete()
          } catch (err) {
            observer.error(TRPCClientError.from(err as Error))
          }
        }

        void execute()
      })
    }
  }
}
