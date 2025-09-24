import cluster from "cluster"
import { env } from "elysia"
import os from "os"
import process from "process"
export type { App } from "./server"
if (cluster.isPrimary) {
    for (let i = 0; i < os.availableParallelism(); i++) {
        cluster.fork()
    }
} else {
    await import("./server")
    console.log(`Worker ${process.pid} started`)
}
