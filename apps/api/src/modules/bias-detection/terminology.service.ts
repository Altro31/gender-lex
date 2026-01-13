import { EnvsService } from "@/shared/envs.service"
import { Effect } from "effect"
import { UMLSJS } from "umlsjs"

export class TerminologyService extends Effect.Service<TerminologyService>()(
    "TerminologyService",
    {
        effect: Effect.gen(function* () {
            const env = yield* EnvsService
            const token = new UMLSJS.UMLSToken(env.UMLS_API_URL)
            return {
                search: (term: string) =>
                    Effect.gen(function* () {
                        const st = yield* Effect.promise(token.getSt)
                        const searcher = new UMLSJS.UMLSSearch(st)
                        yield* Effect.promise(() => searcher.init(term))
                        yield* Effect.promise(searcher.query)
                        return searcher.getResults()
                    }),
            }
        }),
        dependencies: [EnvsService.Default],
    },
) {
    static provide = Effect.provide(this.Default)
}
