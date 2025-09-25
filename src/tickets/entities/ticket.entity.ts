import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { SeatClass } from "src/common/class.enum";
import { Flight } from "src/flights/entities/flight.entity";
import { TicketStatus } from "src/common/tikcets.enum";
import { Seat } from "src/seats/entities/seat.entity";

@Entity('tickets')
export class Ticket {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        eager: true
    })
    user: User;

    @ManyToOne(() => Flight, flight => flight.id, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        eager: true
    })
    flight: Flight;

    @ManyToOne(() => Seat, (seat) => seat.id, { eager: true })
    seat: Seat;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.BOOKED })
    status: TicketStatus;
}
