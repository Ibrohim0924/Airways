import { PartialType } from '@nestjs/mapped-types';
import { CreateAirportDto } from './create-airaport.dto';

export class UpdateAiraportDto extends PartialType(CreateAirportDto) {}
