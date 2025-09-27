import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('flights')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) { }

  @Post()
  async create(@Body() createFlightDto: CreateFlightDto) {
    return this.flightsService.create(createFlightDto);
  }

  @Get()
  async findAll() {
    return this.flightsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.flightsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFlightDto: UpdateFlightDto) {
    return this.flightsService.update(+id, updateFlightDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.flightsService.remove(+id);
  }
}
