import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PresetService } from './preset.service';
import { CreatePresetDto } from './dto/create-preset.dto';
import { UpdatePresetDto } from './dto/update-preset.dto';

@Controller('preset')
export class PresetController {
  constructor(private readonly presetService: PresetService) {}

  @Post()
  create(@Body() createPresetDto: CreatePresetDto) {
    return this.presetService.create(createPresetDto);
  }

  @Get()
  findAll() {
    return this.presetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePresetDto: UpdatePresetDto) {
    return this.presetService.update(+id, updatePresetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presetService.remove(+id);
  }
}
