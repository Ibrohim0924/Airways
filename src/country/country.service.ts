import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Repository } from 'typeorm';
@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
  ) { }
  async create(createCountryDto: CreateCountryDto) {
    const exists = await this.countryRepo.findOne({ where: { name: createCountryDto.name } })
    if (exists) {
      throw new ConflictException(`Bu ${createCountryDto.name} allaqachon mavjud`)
    }
    const country = this.countryRepo.create(createCountryDto)
    await this.countryRepo.save(country)
    return { message: 'Mamlakat muvafaqiyatli bajarildi' }
  }

  async findAll() {
    const countries = await this.countryRepo.find({ relations: ['airports'] })
    return countries
  }

  async findOne(id: number) {
    const country = await this.countryRepo.findOne({ where: { id }, relations: ['airports'] })
    if (!country) {
      throw new NotFoundException('Mamlakat topilmadi')
    }
    return country
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    const country = await this.findOne(id)
    if(!country){
      throw new NotFoundException('Mamlakat topilmadi')
    }
    if (updateCountryDto.name && updateCountryDto.name !== country.name) {
      const exists = await this.countryRepo.findOne({ where: { name: updateCountryDto.name } })
      if (exists) {
        throw new ConflictException(`Bu ${updateCountryDto.name} allaqachon mavjud`)
      }
      country.name = updateCountryDto.name
    }
    await this.countryRepo.save(country)
    return { message: "Mamlakat ma'lumotlari muvafaqiyatli yangilandi" }
  }

  async remove(id: number) {
    const country = await this.findOne(id)
    if (!country) {
      throw new NotFoundException('Mamlakat topilmadi')
    }
    await this.countryRepo.delete(country)
    return { message: "Mamlakat muvafaqiyatli o'chirildi" }
  }
}
