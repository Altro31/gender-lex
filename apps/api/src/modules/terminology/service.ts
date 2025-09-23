import env from "@/lib/env"
import Elysia from "elysia"
import { UMLSJS } from "umlsjs"

export const terminologyService = new Elysia({ name: "terminology.service" })
    .use(env)
    .derive({ as: "global" }, ({ env }) => {
        const token = new UMLSJS.UMLSToken(env.UMLS_API_URL)
        return {
            terminologyService: {
                async search(term: string) {
                    const st = await token.getSt()
                    const searcher = new UMLSJS.UMLSSearch(st)
                    await searcher.init(term)
                    await searcher.query()
                    return searcher.getResults()
                },
            },
        }
    })
