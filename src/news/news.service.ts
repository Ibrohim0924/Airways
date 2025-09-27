import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/common/roles.enum';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepo: Repository<News>,
    private readonly adminService: AdminService
  ) { }
  async create(createNewsDto: CreateNewsDto) {
    const admin = await this.adminService.findOne(createNewsDto.createdBy);
    if (!admin) {
      throw new NotFoundException('Admin topilmadi')
    }

    if (admin.role !== Role.ADMIN && admin.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Faqat adminlar yangilik yarata oladi')
    }
    const news = await this.newsRepo.create({
      title: createNewsDto.title,
      content: createNewsDto.content,
      createdBy: admin
    })
    await this.newsRepo.save(news)
    return { message: "Yangilik muvaffaqiyatli yaratildi" }
  }

  async findAll() {
    const news = await this.newsRepo.find({ relations: ['createdBy'] })
    return news
  }

  async findOne(id: number) {
    const news = await this.newsRepo.findOne({ where: { id }, relations: ['createdBy'] })
    if (!news) {
      throw new NotFoundException('Yangiliklar topilmadi')
    }
    return news
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    const news = await this.newsRepo.findOne({ where: { id }, relations: ['createdBy'] })
    if (!news) {
      throw new NotFoundException('Yangiliklar topilmadi')
    }
    const admin = await this.adminService.findOne(news.createdBy.id);
    if (!admin) {
      throw new NotFoundException('Admin topilmadi')
    }
    if (admin.role !== Role.ADMIN && admin.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Faqat adminlar yangilikni yangilay oladi')
    }
    Object.assign(news, updateNewsDto);
    return this.newsRepo.save(news);

  }

  async remove(id: number) {
    const news = await this.newsRepo.findOne({ where: { id } })
    if (!news) {
      throw new NotFoundException('Yangilik topilmadi')
    }
    const admin = await this.adminService.findOne(news.createdBy.id);
    if (!admin) {
      throw new NotFoundException('Admin topilmadi')
    }
    if (admin.role !== Role.ADMIN && admin.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException("Admin faqat yanglikni o'chira oladi")
    }
    await this.newsRepo.delete(news)
    return { message: "Yangilik muvaffaqiyatli o'chirildi" }
  }
}
