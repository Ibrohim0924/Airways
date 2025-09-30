import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { News } from '../../news/entities/news.entity';
import { Role } from '../../common/roles.enum'; 
import { Flight } from '../../flights/entities/flight.entity';

@Entity('admins')
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    username: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    passwordHash: string;

    @Column({ type: 'enum', enum: Role, default: Role.ADMIN })
    role: Role;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToMany(() => News, (news) => news.createdBy)
    news: News[];

    @OneToMany(() => Flight, (flight) => flight.createdBy)
    flight: Flight[]
}
