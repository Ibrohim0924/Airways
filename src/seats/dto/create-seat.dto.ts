import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { SeatClass } from 'src/common/class.enum';

export class CreateSeatDto {
  @IsNumber()
  flightId: number;

  @IsString()
  @IsNotEmpty()
  seatNumber: string;

  @IsEnum(SeatClass)
  seatClass: SeatClass;
}
