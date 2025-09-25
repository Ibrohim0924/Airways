import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm/repository/Repository.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const { phone_number, email } = createUserDto;
    const checkPhone = await this.userRepo.findOne({ where: { phone_number } });
    if (checkPhone) {
      throw new ConflictException('This phone number is already exists');
    }
    const checkEmail = await this.userRepo.findOne({ where: { email } });
    if (checkEmail) {
      throw new ConflictException('This email is already exists');
    }
    const newUser = this.userRepo.create(createUserDto);
    return this.userRepo.save(newUser);
  }

  async findAll() {
    const users = await this.userRepo.find();
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.userRepo.findOne({ where: { email: updateUserDto.email } });
      if (emailExists) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateUserDto.phone_number && updateUserDto.phone_number !== user.phone_number) {
      const phoneExists = await this.userRepo.findOne({ where: { phone_number: updateUserDto.phone_number } });
      if (phoneExists) {
        throw new ConflictException('Phone number already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepo.remove(user);
  }
}
