import { Flight } from "src/flights/entities/flight.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('reviews')
export class Review {

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
    })
    flight: Flight;

    @Column({ type: 'int' })
    rating: number; 

    @Column({ type: 'text' })
    comment: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}

