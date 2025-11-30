import { FetchHttpClient, HttpClient } from '@effect/platform'
import { Effect } from 'effect'

export class HttpService extends Effect.Service<HttpService>()('HttpService', {
	effect: HttpClient.HttpClient,
	dependencies: [FetchHttpClient.layer],
}) {
	static provide = Effect.provide(this.Default)
}
