import { PartialType } from '@nestjs/mapped-types';
import { CreateLoyaltyprogramDto } from './create-loyaltyprogram.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateLoyaltyProgramDto extends PartialType(CreateLoyaltyprogramDto) {
    @IsOptional()
    @IsNumber()
    points?: number;
}
