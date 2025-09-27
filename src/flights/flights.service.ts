import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { Repository } from 'typeorm/repository/Repository.js';

@Injectable()
export class FlightsService {
  constructor(@InjectRepository(Flight) private flightsRepository: Repository<Flight>) { }

  async create(createFlightDto: CreateFlightDto) {
    const { flightNumber, departureTime } = createFlightDto;
    const checkFlightNumber = await this.flightsRepository.findOne({ where: { flightNumber } });
    if (checkFlightNumber) {
      throw new ConflictException('Bunday reys allaqachon mavjud');
    }
    const checkDepartureTime = await this.flightsRepository.findOne({ where: { departureTime } });
    if (checkDepartureTime) {
      throw new ConflictException('Bunday vaqtda reys allaqachon mavjud');
    }

    const newFlight = await this.flightsRepository.create(createFlightDto);
    await this.flightsRepository.save(newFlight);
  }

  async findAll() {
    const flights = await this.flightsRepository.find();
    return flights;
  }

  async findOne(id: number) {
    const flight = await this.flightsRepository.findOne({ where: { id } });
    if (!flight) {
      throw new NotFoundException('Bunday reys mavjud emas');
    }
    return flight;
  }

  async update(id: number, dto: UpdateFlightDto) {
    const flight = await this.findOne(id);

    if (dto.flightNumber && dto.flightNumber !== flight.flightNumber) {
      const exists = await this.flightsRepository.findOne({
        where: { flightNumber: dto.flightNumber },
      });

      if (exists) {
        throw new ConflictException(`Flight number ${dto.flightNumber} is already taken`);
      }
    }

    Object.assign(flight, dto);
    return this.flightsRepository.save(flight);
  }

  async remove(id: number) {
    const flight = await this.findOne(id);
    if (!flight) {
      throw new NotFoundException('Bunday reys mavjud emas');
    }
    await this.flightsRepository.remove(flight);
    return { message: `Flight ${id} deleted` };
  }

}
