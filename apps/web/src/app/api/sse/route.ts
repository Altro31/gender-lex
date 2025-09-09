import envs from "@/lib/env/env-server"
import { Console, Effect, Schedule } from "effect"
import { type NextRequest } from "next/server"

export async function GET(req: NextRequest) {
	const sseConnection = Effect.tryPromise(() =>
		fetch(envs.API_URL + "/sse", {
			headers: req.headers,
		}),
	).pipe(
		Effect.tap(() => Console.log("Connection stablish!")),
		Effect.tapError(() =>
			Console.log(
				"Connection failed, trying to reconnect in 5 seconds...",
			),
		),
		Effect.retry({
			schedule: Schedule.linear("5 seconds"),
			times: 5,
		}),
		Effect.tapError(() =>
			Console.log(
				"Connection failed, trying to reconnect in 30 seconds...",
			),
		),
		Effect.retry({
			schedule: Schedule.linear("30 seconds"),
		}),
	)
	return Effect.runPromise(sseConnection)
}
