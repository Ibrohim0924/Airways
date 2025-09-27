import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateLoyaltyprogramDto {

    @IsNumber()
    @IsNotEmpty()
    user_id: number
}
