import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAirportDto } from './dto/create-airaport.dto';
import { UpdateAiraportDto } from './dto/update-airaport.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Airport } from './entities/airaport.entity';
import { Repository } from 'typeorm';
import { Country } from 'src/country/entities/country.entity';
import { City } from 'src/city/entities/city.entity';

@Injectable()
export class AiraportService {
  constructor(
    @InjectRepository(Airport)
    private readonly airaportRepo: Repository<Airport>,
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>

  ) { }
  async create(createAirportDto: CreateAirportDto) {
    const { name, code, countryId, cityId } = createAirportDto;

    if (!name) {
      throw new BadRequestException('Airport nomi kiritilishi shart');
    }
    if (!code) {
      throw new BadRequestException('Airport kodi kiritilishi shart');
    }
    if (!countryId) {
      throw new BadRequestException('Country ID kiritilishi shart');
    }
    if (!cityId) {
      throw new BadRequestException('City ID kiritilishi shart');
    }

    const exists = await this.airaportRepo.findOne({ where: { code } });
    if (exists) {
      throw new ConflictException('Bu kod allaqachon mavjud');
    }

    const country = await this.countryRepo.findOne({ where: { id: countryId } });
    if (!country) {
      throw new NotFoundException('Bunday Country topilmadi');
    }

    const city = await this.cityRepo.findOne({ where: { id: cityId } });
    if (!city) {
      throw new NotFoundException('Bunday City topilmadi');
    }

    const airport = this.airaportRepo.create({
      name,
      code,
      country,
      city,
    });

    await this.airaportRepo.save(airport);

    return { message: 'Airport muvaffaqiyatli yaratildi', airport };
  }


  async findAll() {
    const airaports = await this.airaportRepo.find({ relations: ['city', 'country'] })
    return airaports
  }

  async findOne(id: number) {
    const airaport = await this.airaportRepo.findOne({ where: { id }, relations: ['city', 'country'] })
    if (!airaport) {
      throw new NotFoundException('Bunday airaport mavjud emas')
    }
    return airaport
  }

  async update(id: number, updateAirportDto: UpdateAiraportDto) {
    const airport = await this.findOne(id);

    if (updateAirportDto.code && updateAirportDto.code !== airport.code) {
      const exists = await this.airaportRepo.findOne({ where: { code: updateAirportDto.code } });
      if (exists) {
        throw new ConflictException('Bu IATA kodi boshqa aeroportda mavjud');
      }
    }

    if (updateAirportDto.countryId) {
      const country = await this.countryRepo.findOne({ where: { id: updateAirportDto.countryId } });
      if (!country) {
        throw new NotFoundException('Bunday Country topilmadi');
      }
      airport.country = country;
    }

    if (updateAirportDto.cityId) {
      const city = await this.cityRepo.findOne({ where: { id: updateAirportDto.cityId } });
      if (!city) {
        throw new NotFoundException('Bunday City topilmadi');
      }
      airport.city = city;
    }

    if (updateAirportDto.name) {
      airport.name = updateAirportDto.name;
    }
    if (updateAirportDto.code) {
      airport.code = updateAirportDto.code;
    }

    return this.airaportRepo.save(airport);
  }



  async remove(id: number) {
    const airport = await this.findOne(id);
    if (!airport) {
      throw new NotFoundException('Bunday airaport mavjud emas')
    }
    await this.airaportRepo.remove(airport);
    return { message: "Airaport muvaffaqiyatli o'chirildi" };
  }
}

