import { Module } from '@nestjs/common'
import { PresetService } from './preset.service'
import { PresetController } from './preset.controller'
import { PresetRepository } from 'src/app/modules/preset/preset.repository'

@Module({
	controllers: [PresetController],
	providers: [PresetService, PresetRepository],
	exports: [PresetService],
})
export class PresetModule {}
