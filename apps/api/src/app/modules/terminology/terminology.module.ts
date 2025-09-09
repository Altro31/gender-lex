import { Module } from '@nestjs/common'
import { TerminologyService } from 'src/app/modules/terminology/terminology.service'

@Module({ providers: [TerminologyService], exports: [TerminologyService] })
export class TerminologyModule {}
