import { Global, Module } from '@nestjs/common'
import { SseController } from 'src/core/modules/sse/sse.controller'
import { SseService } from 'src/core/modules/sse/sse.service'
import { AuthModule } from 'src/security/modules/auth/auth.module'

@Global()
@Module({
	controllers: [SseController],
	exports: [SseService],
	providers: [SseService],
	imports: [AuthModule],
})
export class SseModule {}
