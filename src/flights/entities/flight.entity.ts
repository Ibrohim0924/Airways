import { PlaneModel } from "src/common/planemodel.enum";
import {  Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Admin } from "src/admin/entities/admin.entity";


@Entity('flights')
export class Flight {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true, length: 10 })
    flight_number: string;

    @Column({ type: 'varchar', length: 100 })
    departureAirport: string;

    @Column({ type: 'varchar', length: 100 })
    arrivalAirport: string;

    @Column({ type: 'timestamp' })
    departureTime: Date; //ketish vaqti

    @Column({ type: 'timestamp' })
    arrivalTime: Date;  //borib qo'nish vaqti

    @Column({ type: 'timestamp', nullable: true })
    returnDepartureTime: Date; //qaytish vaqti

    @Column({ type: 'timestamp', nullable: true })
    returnArrivalTime: Date;  //qaytib qo'nish vaqti

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    OneWayprice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    RoundTripPrice: number;

    @Column({ type: 'enum', enum: PlaneModel })
    planeModel: PlaneModel;

    @Column({ type: 'varchar', length: 100, default: 'planned' })
    status: string //planned, cancelled, delayed, departed, arrived

    @ManyToOne(() => Admin, admin => admin.flight, {eager: true})
    createdBy: Admin;
}

