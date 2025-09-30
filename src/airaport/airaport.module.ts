import { Module } from '@nestjs/common';
import { AiraportService } from './airaport.service';
import { AirportController } from './airaport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airport } from './entities/airaport.entity';
import { City } from 'src/city/entities/city.entity';
import { Country } from 'src/country/entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Airport, City, Country])],
  controllers: [AirportController],
  providers: [AiraportService],
})
export class AiraportModule {}
