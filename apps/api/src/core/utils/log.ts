import { Logger } from '@nestjs/common'

export const bindLogger = (target: any) => {
	return new Logger(target.constructor.name)
}
