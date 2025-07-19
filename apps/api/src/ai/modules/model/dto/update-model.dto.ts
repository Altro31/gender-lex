import { PartialType } from '@nestjs/swagger'
import { CreateModelDTO } from 'src/ai/modules/model/dto/create-model.dto'

export class UpdateModelDTO extends PartialType(CreateModelDTO) {}
