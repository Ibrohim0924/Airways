import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from 'src/seats/entities/seat.entity';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { Flight } from 'src/flights/entities/flight.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }
  async create(dto: CreateTicketDto) {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const flight = await this.flightRepository.findOne({ where: { id: dto.flightId } });
    if (!flight) throw new NotFoundException('Reys topilmadi');

    const seat = await this.seatRepository.findOne({ where: { id: dto.seatId } });
    if (!seat) throw new NotFoundException('O’rindiq topilmadi');
    seat.isBooked = true;
    await this.seatRepository.save(seat);

    const newTicket = this.ticketRepository.create({
      user,
      flight,
      seat,
      price: dto.price
    });
    return this.ticketRepository.save(newTicket);
  }

  async findAll() {
    const tickets = await this.ticketRepository.find({ relations: ['user', 'flight', 'seat'] });
    return tickets;
  }

  async findOne(id: number) {
    const ticket = await this.ticketRepository.findOne({ where: { id }, relations: ['user', 'flight', 'seat'] });
    if (!ticket) {
      throw new NotFoundException('Chipta topilmadi');
    }
    return ticket;
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['user', 'flight', 'seat']
    });
    if (!ticket) {
      throw new NotFoundException('Chipta topilmadi');
    }

    if (updateTicketDto.userId && updateTicketDto.userId !== ticket.user.id) {
      const user = await this.userRepository.findOne({ where: { id: updateTicketDto.userId } });
      if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
      ticket.user = user;
    }

    if (updateTicketDto.flightId && updateTicketDto.flightId !== ticket.flight.id) {
      const flight = await this.flightRepository.findOne({ where: { id: updateTicketDto.flightId } });
      if (!flight) throw new NotFoundException('Reys topilmadi');
      ticket.flight = flight;
    }

    if (updateTicketDto.seatId && updateTicketDto.seatId !== ticket.seat.id) {
      const seat = await this.seatRepository.findOne({ where: { id: updateTicketDto.seatId } });
      if (!seat) throw new NotFoundException('O’rindiq topilmadi');
      ticket.seat.isBooked = false;
      await this.seatRepository.save(ticket.seat);
      seat.isBooked = true;
      await this.seatRepository.save(seat);
      ticket.seat = seat;
    }

    if (updateTicketDto.price) {
      ticket.price = updateTicketDto.price;
    }

    if (updateTicketDto.status) {
      ticket.status = updateTicketDto.status;
    }

    return this.ticketRepository.save(ticket);
  }

  async remove(id: number) {
    const ticket = await this.ticketRepository.findOne({ where: { id }, relations: ['seat'] });
    if (!ticket) {
      throw new NotFoundException('Chipta topilmadi');
    }
    ticket.seat.isBooked = false;
    await this.seatRepository.save(ticket.seat);
    await this.ticketRepository.remove(ticket);
    return { message: "Chipta o'chirildi" };
  }
}
