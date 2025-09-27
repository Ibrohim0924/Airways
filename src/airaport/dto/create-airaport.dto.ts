import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateAirportDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @Length(2, 10)
    code: string;

    @IsString()
    @IsNotEmpty()
    countryId: number;
}
