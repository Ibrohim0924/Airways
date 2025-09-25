import { Role } from "src/common/roles.enum";
import { Flight } from "src/flights/entities/flight.entity";
import { Review } from "src/reviews/entities/review.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    firstName: string;

    @Column({ type: 'varchar', length: 100 })
    lastName: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    phone_number: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    passwordHash: string;

    @Column({ type: 'date', nullable: true })
    dateOfBirth: Date;

    @OneToMany(() => Review, review => review.user)
    reviews: Review[];

    @OneToMany(() => Flight, flight => flight.id)
    flights: Flight[];

}
