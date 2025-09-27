import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PlaneModel } from "src/common/planemodel.enum";

export class CreateFlightDto {
  @IsString()
  @IsNotEmpty()
  flightNumber: string;

  @IsNumber()
  departureAirportId: number;

  @IsNumber()
  arrivalAirportId: number;

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

  @IsOptional()
  @IsNumber()
  oneWayPrice?: number;

  @IsOptional()
  @IsNumber()
  roundTripPrice?: number;

  @IsEnum(PlaneModel)
  planeModel: PlaneModel;

  @IsOptional()
  @IsString()
  status?: string;

  @IsNumber()
  createdById: number;
}
