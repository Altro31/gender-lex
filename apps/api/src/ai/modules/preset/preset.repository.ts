import { Injectable } from '@nestjs/common'
import { BaseRepository } from 'src/core/utils/repository'

@Injectable()
export class PresetRepository extends BaseRepository('preset') {
	create() {
		return this.model
	}
}
