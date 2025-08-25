import { Module } from '@nestjs/common'
import { BiasDetectionService } from 'src/app/modules/bias-detection/bias-detection.service'

@Module({ exports: [BiasDetectionService], providers: [BiasDetectionService] })
export class BiasDetectionModule {}
