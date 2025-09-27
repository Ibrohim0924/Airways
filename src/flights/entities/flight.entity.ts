import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PlaneModel } from "src/common/planemodel.enum";
import { Airport } from "src/airaport/entities/airaport.entity";
import { Admin } from "src/admin/entities/admin.entity";

@Entity('flights')
export class Flight {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true, length: 10 })
    flightNumber: string;

    @ManyToOne(() => Airport, (airport) => airport.departures, { eager: true })
    departureAirport: Airport;

    @ManyToOne(() => Airport, (airport) => airport.arrivals, { eager: true })
    arrivalAirport: Airport;

    @Column({ type: 'timestamp' })
    departureTime: Date;

    @Column({ type: 'timestamp' })
    arrivalTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    returnDepartureTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    returnArrivalTime: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    oneWayPrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    roundTripPrice: number;

    @Column({ type: 'enum', enum: PlaneModel })
    planeModel: PlaneModel;

    @Column({ type: 'varchar', length: 100, default: 'planned' })
    status: string; // planned, cancelled, delayed, departed, arrived

    @ManyToOne(() => Admin, (admin) => admin.flight, { eager: true })
    createdBy: Admin;
}
