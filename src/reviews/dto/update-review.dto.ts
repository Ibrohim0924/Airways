import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { IsInt, Max, Min } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}
