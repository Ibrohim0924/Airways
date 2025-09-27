import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAirportDto } from './dto/create-airaport.dto';
import { UpdateAiraportDto } from './dto/update-airaport.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Airport } from './entities/airaport.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AiraportService {
  constructor(
    @InjectRepository(Airport) private readonly airaportRepo: Repository<Airport>
  ) { }
  async create(createAiraportDto: CreateAirportDto) {
    const exists = await this.airaportRepo.findOne({ where: { code: createAiraportDto.code } })
    if (exists) {
      throw new ConflictException('Bu kod allaqachon mavjud')
    }
    const airaport = this.airaportRepo.create(createAiraportDto)
    await this.airaportRepo.save(airaport)
    return { message: 'Airaport muvafaqiyatli bajarildi' }
  }

  async findAll() {
    const airaports = await this.airaportRepo.find()
    return airaports
  }

  async findOne(id: number) {
    const airaport = await this.airaportRepo.findOne({ where: { id } })
    if (!airaport) {
      throw new NotFoundException('Bunday airaport mavjud emas')
    }
    return airaport
  }

  async update(id: number, updateAiraportDto: UpdateAiraportDto) {
    const airport = await this.findOne(id);

    if (updateAiraportDto.code && updateAiraportDto.code !== airport.code) {
      const exists = await this.airaportRepo.findOne({ where: { code: updateAiraportDto.code } });
      if (exists) throw new ConflictException('Bu IATA kodi boshqa aeroportda mavjud');
    }

    Object.assign(airport, updateAiraportDto);
    return this.airaportRepo.save(airport);
  }


  async remove(id: number) {
    const airport = await this.findOne(id);
    if(!airport){
      throw new NotFoundException('Bunday airaport mavjud emas')
    }
    await this.airaportRepo.delete(airport);
    return { message: "Airaport muvaffaqiyatli o'chirildi" };
  }
}

