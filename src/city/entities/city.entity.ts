import { Airport } from "src/airaport/entities/airaport.entity";
import { Country } from "src/country/entities/country.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('cities')
export class City {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @OneToMany(() => Airport, (airport) => airport.city)
    airports: Airport[];

    @ManyToOne(() => Country, (country) => country.cities, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    country: Country;
}
