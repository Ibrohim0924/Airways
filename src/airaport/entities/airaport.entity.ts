import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flight } from "src/flights/entities/flight.entity";
import { Country } from "src/country/entities/country.entity";
import { City } from "src/city/entities/city.entity";

@Entity('airports')
export class Airport {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'varchar', length: 10, unique: true })
    code: string;

    @OneToMany(() => Flight, (flight) => flight.departureAirport)
    departures: Flight[];

    @OneToMany(() => Flight, (flight) => flight.arrivalAirport)
    arrivals: Flight[];

    @OneToMany(() => Country, (country) => country.airports, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    country: Country;

    @ManyToOne(() => City, (city) => city.airports, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    city: City;

}
