import { SeatClass } from "src/common/class.enum";
import { Flight } from "src/flights/entities/flight.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('seats')
@Unique(['flight', 'seatNumber'])
export class Seat {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Flight, flight => flight.id, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',})
    flight: Flight;

    @Column({ type: 'varchar', length: 5, unique: true })
    seatNumber: string;

    @Column({ type: 'enum', enum: SeatClass})
    seatClass: SeatClass;

    @Column({ type: 'boolean', default: false })
    isBooked: boolean;
}

