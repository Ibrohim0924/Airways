import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { Role } from 'src/common/roles.enum';
import { Transform } from 'class-transformer';

export class SignupAuthDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  lastName: string;

  @IsString()
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

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
