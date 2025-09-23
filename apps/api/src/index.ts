import cluster from "cluster"
import os from "os"
import process from "process"
export type { App } from "./server"

if (cluster.isPrimary) {
    console.log(os.availableParallelism())
    for (let i = 0; i < os.availableParallelism(); i++) {
        console.log("forked")
        cluster.fork()
    }
} else {
    await import("./server")
    console.log(`Worker ${process.pid} started`)
}
