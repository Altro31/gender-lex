import { Console, Context, Effect, Layer, } from 'effect'

export class LoggerService extends Context.Tag('LoggerService')<
	LoggerService,
	{ log(message: string): Effect.Effect<void, never, never> }
>() {
	static Default(module: string) {
		return Layer.succeed(LoggerService, {
			log: message =>
				Console.info(
					`[${new Date().toISOString()}] [INFO] ${module}: ${message}`,
				),
		})
	}

	static provide(module: string) {
		return Effect.provide(LoggerService.Default(module))
	}
	static layerProvide(module: string) {
		return Layer.provide(LoggerService.Default(module))
	}
}

/*

export const LoggerService = <Name extends string>(module: Name) =>
	class LoggerService extends Effect.Service<LoggerService>()(
		`${module}LoggerService`,
		{
			sync: () => ({
				log(message: string) {
					return Console.log(
						`[LOG] [${new Date().toLocaleString()}] ${module}: ${message}`,
					)
				},
			}),
		},
	) {}

	*/
