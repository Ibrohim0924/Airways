import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from 'src/country/entities/country.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
  ) { }
  async create(createCityDto: CreateCityDto) {
    const country = await this.countryRepo.findOne({ where: { id: createCityDto.countryId } })
    if (!country) {
      throw new NotFoundException('Mamlakat topilmadi')
    }
    const exists = await this.cityRepo.findOne({ where: { name: createCityDto.name } })
    if (exists) {
      throw new ConflictException(`Bu ${createCityDto.name} allaqachon mavjud`)
    }
    const newCity = this.cityRepo.create({ name: createCityDto.name, country })
    await this.cityRepo.save(newCity)
    return { message: "Shahar muvafaqiyatli qo'shildi" }
  }

  async findAll() {
    const cities = await this.cityRepo.find({ relations: ['country'] })
    return cities
  }

  async findOne(id: number) {
    const city = await this.cityRepo.findOne({ where: { id }, relations: ['country'] })
    if (!city) {
      throw new NotFoundException('Shahar topilmadi')
    }
    return city
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    const city = await this.findOne(id)
    if (updateCityDto.name && updateCityDto.name !== city.name) {
      const exists = await this.cityRepo.findOne({
        where: { name: updateCityDto.name, country: { id: city.country.id } }
      })
      if (exists) {
        throw new ConflictException(`Bu ${updateCityDto.name} allaqachon mavjud`)
      }
      city.name = updateCityDto.name
    }
    if( updateCityDto.countryId && updateCityDto.countryId !== city.country.id){
      const country = await this.countryRepo.findOne({ where: { id: updateCityDto.countryId } })
      if(!country){
        throw new NotFoundException('Mamlakat topilmadi')
      }
      city.country = country
    }
    await this.cityRepo.save(city)
    return { message: "Shahar ma'lumotlari muvafaqiyatli yangilandi" }
  }

  async remove(id: number) {
    const city = await this.findOne(id)
    await this.cityRepo.delete(city)
    return { message: "Shahar muvafaqiyatli o'chirildi" };
  }
}
