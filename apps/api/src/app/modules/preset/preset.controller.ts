import { Controller } from '@nestjs/common'
import { bindLogger } from 'src/core/utils/log'
import { PresetService } from './preset.service'

@Controller('Preset')
export class PresetController {
	private readonly logger = bindLogger(this)
	constructor(private readonly presetService: PresetService) {}
}
