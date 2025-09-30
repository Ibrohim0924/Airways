import { IsOptional, IsString } from 'class-validator';

export class CancelFlightDto {
    @IsOptional()
    @IsString()
    reason?: string;
}
