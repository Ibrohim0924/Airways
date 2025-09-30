import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SeatClass } from 'src/common/class.enum';

export class CreateSeatDto {
  @ApiProperty({ example: 42, description: 'Unique identifier of the flight the seat belongs to.' })
  @IsNumber()
  flightId: number;

  @ApiProperty({ example: '12A', description: 'Seat number displayed to passengers.' })
  @IsString()
  @IsNotEmpty()
  seatNumber: string;

  @ApiProperty({ enum: SeatClass, enumName: 'SeatClass', example: SeatClass.ECONOMY, description: 'Cabin class of the seat.' })
  @IsEnum(SeatClass)
  seatClass: SeatClass;
}