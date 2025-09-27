import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AiraportService } from './airaport.service';
import { CreateAirportDto } from './dto/create-airaport.dto';
import { UpdateAiraportDto } from './dto/update-airaport.dto';

@Controller('airaport')
export class AiraportController {
  constructor(private readonly airaportService: AiraportService) {}

  @Post()
  create(@Body() createAiraportDto: CreateAirportDto) {
    return this.airaportService.create(createAiraportDto);
  }

  @Get()
  findAll() {
    return this.airaportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airaportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAiraportDto: UpdateAiraportDto) {
    return this.airaportService.update(+id, updateAiraportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.airaportService.remove(+id);
  }
}
