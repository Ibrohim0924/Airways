import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoyaltyprogramService } from './loyaltyprogram.service';
import { CreateLoyaltyprogramDto } from './dto/create-loyaltyprogram.dto';
import { UpdateLoyaltyProgramDto } from './dto/update-loyaltyprogram.dto';

@Controller('loyaltyprogram')
export class LoyaltyprogramController {
  constructor(private readonly loyaltyprogramService: LoyaltyprogramService) {}

  @Post()
  create(@Body() createLoyaltyprogramDto: CreateLoyaltyprogramDto) {
    return this.loyaltyprogramService.create(createLoyaltyprogramDto);
  }

  @Get()
  findAll() {
    return this.loyaltyprogramService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loyaltyprogramService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoyaltyprogramDto: UpdateLoyaltyProgramDto) {
    return this.loyaltyprogramService.update(+id, updateLoyaltyprogramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loyaltyprogramService.remove(+id);
  }
}
