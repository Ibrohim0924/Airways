import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { Repository } from 'typeorm/repository/Repository.js';
import { Flight } from 'src/flights/entities/flight.entity';
import { SeatClass } from 'src/common/class.enum';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private seatsRepository: Repository<Seat>,

    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
  ) { }

  async create(createSeatDto: CreateSeatDto) {
    const { flightId, seatNumber, seatClass } = createSeatDto;

    const flight = await this.flightRepository.findOne({ where: { id: flightId } });
    if (!flight) throw new NotFoundException('Bunday reys mavjud emas');

    // Klass bo‘yicha limitni tekshirish
    const planeModel = flight.planeModel;
    const classLimit = SeatClass[planeModel][seatClass];

    const existingSeatsCount = await this.seatsRepository.count({
      where: { flight: { id: flightId }, seatClass },
    });

    if (existingSeatsCount >= classLimit) {
      throw new ConflictException(`${seatClass} uchun barcha joylar band (${classLimit} ta)`);
    }

    // Seat raqami unikalmi?
    const exists = await this.seatsRepository.findOne({
      where: { flight: { id: flightId }, seatNumber },
    });
    if (exists) {
      throw new ConflictException(`Seat ${seatNumber} allaqachon mavjud`);
    }

    // Yangi seat yaratish
    const newSeat = this.seatsRepository.create({
      flight,
      seatNumber,
      seatClass,
      isBooked: false,
    });

    return this.seatsRepository.save(newSeat);
  }

  async findAll() {
    const seats = await this.seatsRepository.find({ relations: ['flight'] });
    return seats;
  }

  async findOne(id: number) {
    const seat = await this.seatsRepository.findOne({ where: { id }, relations: ['flight'] });
    if (!seat) {
      throw new NotFoundException('O‘rindiq topilmadi');
    }
    return seat;
  }

  async update(id: number, updateSeatDto: UpdateSeatDto) {
    const seat = await this.findOne(id);

    if (updateSeatDto.seatNumber && updateSeatDto.seatNumber !== seat.seatNumber) {
      const exists = await this.seatsRepository.findOne({
        where: { flight: { id: seat.flight.id }, seatNumber: updateSeatDto.seatNumber },
      });
      if (exists) {
        throw new ConflictException(`Seat ${updateSeatDto.seatNumber} allaqachon mavjud`);
      }
    }

    Object.assign(seat, updateSeatDto);
    return this.seatsRepository.save(seat);

  }
  async remove(id: number) {
    const seat = await this.seatsRepository.findOne({ where: { id } });
    if (!seat) {
      throw new NotFoundException('O‘rindiq topilmadi');
    }
    await this.seatsRepository.remove(seat);
    return { message: "O'rindiq muvaffaqiyatli o'chirildi" };
  }
}
