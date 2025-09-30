import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flight } from "../../flights/entities/flight.entity";
import { Country } from "../../country/entities/country.entity";
import { City } from "../../city/entities/city.entity";

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

    @ManyToOne(() => Country, (country) => country.airports, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'countryId' })
    country: Country;

    @ManyToOne(() => City, (city) => city.airports, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    city: City;

}
