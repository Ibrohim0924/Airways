import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) { }

  async create(dto: CreateAdminDto) {

    const emailExists = await this.adminRepo.findOne({
      where: { email: dto.email },
    });
    if (emailExists) {
      throw new ConflictException('Bunday email allaqachon mavjud');
    }

    const usernameExists = await this.adminRepo.findOne({
      where: { username: dto.username },
    });
    if (usernameExists) {
      throw new ConflictException('Bunday username allaqachon mavjud');
    }


    const hash = await bcrypt.hash(dto.password, 10);

    const admin = this.adminRepo.create({
      username: dto.username,
      email: dto.email,
      passwordHash: hash,
      role: dto.role,
    });

    return this.adminRepo.save(admin);
  }

  async findAll() {
    const admin = await this.adminRepo.find()
    return admin
  }

  async findOne(id: number) {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('Admin topilmadi');
    }
    return admin;
  }

  async update(id: number, dto: UpdateAdminDto) {
    const admin = await this.findOne(id);

    if (dto.email && dto.email !== admin.email) {
      const emailExists = await this.adminRepo.findOne({
        where: { email: dto.email },
      });
      if (emailExists) {
        throw new ConflictException('Bunday email allaqachon mavjud');
      }
      admin.email = dto.email;
    }

    if (dto.username && dto.username !== admin.username) {
      const usernameExists = await this.adminRepo.findOne({
        where: { username: dto.username },
      });
      if (usernameExists) {
        throw new ConflictException('Bunday username allaqachon mavjud');
      }
      admin.username = dto.username;
    }

    if (dto.password) {
      admin.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    if (dto.role) {
      admin.role = dto.role;
    }

    return this.adminRepo.save(admin);
  }

  async remove(id: number) {
    const admin = await this.adminRepo.findOne({ where: { id } })
    if (!admin) {
      throw new NotFoundException('Admin topilmadi')
    }
    await this.adminRepo.delete(id)
    return { message: "Admin muvaffaqiyatli o'chirildi" }
  }
}
