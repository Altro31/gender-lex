import cluster from "cluster"
import { env } from "elysia"
import os from "os"
import process from "process"
export type { App } from "./server"
console.log(env.PORT)
if (cluster.isPrimary) {
    console.log(os.availableParallelism())
    for (let i = 0; i < os.availableParallelism(); i++) {
        console.log("forked")
        cluster.fork()
    }
} else {
    console.log("trying to import")
    await import("./server")
    console.log(`Worker ${process.pid} started`)
}
