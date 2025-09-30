import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AiraportService } from './airaport.service';
import { CreateAirportDto } from './dto/create-airaport.dto';
import { UpdateAiraportDto } from './dto/update-airaport.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/common/roles.enum';

@Controller('airport')
export class AirportController {
  constructor(private readonly airportService: AiraportService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  create(@Body() createAirportDto: CreateAirportDto) {
    return this.airportService.create(createAirportDto);
  }

  @Get()
  findAll() {
    return this.airportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airportService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateAiraportDto: UpdateAiraportDto) {
    return this.airportService.update(+id, updateAiraportDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.airportService.remove(+id);
  }
}
