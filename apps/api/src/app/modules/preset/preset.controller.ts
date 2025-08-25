import { Controller } from '@nestjs/common'
import { PresetService } from './preset.service'
import { BaseController } from 'src/core/utils/controller'

@Controller('Preset')
export class PresetController extends BaseController {
	constructor(private readonly presetService: PresetService) {
		super()
	}
}
