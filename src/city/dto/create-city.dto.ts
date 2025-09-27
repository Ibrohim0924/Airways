import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateCityDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 150)
    name: string;

    @IsNumber()
    @IsNotEmpty()
    countryId: number;
}
