import { Injectable } from '@nestjs/common'
import { PresetRepository } from 'src/app/modules/preset/preset.repository'

@Injectable()
export class PresetService {
	constructor(public readonly repository: PresetRepository) {}
}
