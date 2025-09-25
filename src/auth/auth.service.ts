import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignupAuthDto } from './dto/signup-auth.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/roles.enum';
import { SigninAuthDto } from './dto/signin-auth.dto';


@Injectable()
export class AuthService {
  constructor(@InjectRepository(User)
  private userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }
  async signup(dto: SignupAuthDto) {
    const emailExists = await this.userRepository.findOne({ where: { email: dto.email } });
    if (emailExists) {
      throw new ConflictException('Email allaqachon ro‘yxatdan o‘tgan');
    }
    const phoneExists = await this.userRepository.findOne({ where: { phone_number: dto.phone_number } });
    if (phoneExists) {
      throw new ConflictException('Telefon raqam allaqachon ro‘yxatdan o‘tgan');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const newUser = this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone_number: dto.phone_number,
      email: dto.email,
      passwordHash: hash,
      dateOfBirth: dto.dateOfBirth,
    });
    const savedUser = await this.userRepository.save(newUser);

    const payload = { sub: savedUser.id };
    return {
      access_token: this.jwtService.sign(payload),
      savedUser
    }
  }

  async signin(dto: SigninAuthDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Email yoki parol noto‘g‘ri');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email yoki parol noto‘g‘ri');
    }
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user
    }
  }
}
