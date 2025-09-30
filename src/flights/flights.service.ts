import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { Repository } from 'typeorm/repository/Repository.js';
import { Airport } from 'src/airaport/entities/airaport.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private flightsRepository: Repository<Flight>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
    private readonly dataSource: DataSource,

  ) { }

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
    return { message: 'Reys muvaffaqiyatli yaratildi', flight: newFlight };
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

  async cancelFlight(id: number, reason?: string) {
    const flight = await this.flightsRepository.findOne({ where: { id } });
    if (!flight) {
      throw new NotFoundException('Bunday reys mavjud emas');
    }
    if (['departed', 'arrived'].includes(flight.status)) {
      throw new BadRequestException(
        `Reys holati '${flight.status}', bekor qilib bo‘lmaydi`,
      );
    }
    if (flight.status === 'cancelled') {
      throw new ConflictException('Reys allaqachon bekor qilingan');
    }
    return this.dataSource.transaction(async (manager) => {
      flight.status = 'cancelled'
      await manager.save(Flight, flight)

      const tickets = await manager.find(Ticket, { where: { flight: { id } }, relations: ['seat'] })
      for (const ticket of tickets) {
        ticket.status = 'Cancelled' as any
        await manager.save(Ticket, ticket)

        if (ticket.seat) {
          ticket.seat.isBooked = false
          await manager.save(Seat, ticket.seat)
        }
      }
    })
  }

  async setStatus(id: number, status: 'planned' | 'cancelled' | 'delayed' | 'departed' | 'arrived') {
    const flight = await this.flightsRepository.findOne({ where: { id } });
    if (!flight) throw new NotFoundException('Reys topilmadi');

    if (['departed', 'arrived'].includes(flight.status) && status === 'cancelled') {
      throw new BadRequestException('Departed/Arrived reysni cancelled qilish mumkin emas');
    }

    flight.status = status;
    await this.flightsRepository.save(flight);
    return { message: 'Status yangilandi', id: flight.id, status: flight.status };
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
