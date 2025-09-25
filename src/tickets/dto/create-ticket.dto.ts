import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTicketDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number; 

  @IsNumber()
  @IsNotEmpty()
  flightId: number;

  @IsNumber()
  @IsNotEmpty()
  seatId: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
