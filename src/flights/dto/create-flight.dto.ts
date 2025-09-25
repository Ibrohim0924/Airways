import { IsNotEmpty, IsString, IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { PlaneModel } from 'src/common/planemodel.enum';

export class CreateFlightDto {
  @IsString()
  @IsNotEmpty()
  flight_number: string;

  @IsString()
  @IsNotEmpty()
  departureAirport: string;

  @IsString()
  @IsNotEmpty()
  arrivalAirport: string;

  @IsDateString()
  departureTime: Date;

  @IsDateString()
  arrivalTime: Date;

  @IsOptional()
  @IsDateString()
  returnDepartureTime?: Date;

  @IsOptional()
  @IsDateString()
  returnArrivalTime?: Date;

  @IsNumber()
  @IsNotEmpty()
  OneWayprice: number;

  @IsOptional()
  @IsNumber()
  RoundTripPrice?: number;

  @IsEnum(PlaneModel)
  planeModel: PlaneModel;
}
