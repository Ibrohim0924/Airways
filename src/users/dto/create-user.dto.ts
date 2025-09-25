import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from 'src/common/roles.enum';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    lastName: string;

    @IsNotEmpty()
    @Transform(({ value }) => {
        if (!value.startsWith('+998')) {
            return `+998${value}`;
        }
        return value;
    })
    @Matches(/^\+998(9[0-9]|33|88|71)\d{7}$/, {
        message: 'Telefon raqami O‘zbekiston formati bo‘lishi kerak',
    })
    phone_number: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 100)
    password: string;

    @IsOptional()
    @IsString()
    dateOfBirth?: string;

    
}
