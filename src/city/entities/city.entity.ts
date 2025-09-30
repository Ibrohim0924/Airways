import { Airport } from "../../airaport/entities/airaport.entity";
import { Country } from "../../country/entities/country.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('cities')
export class City {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @OneToMany(() => Airport, (airport) => airport.city, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    airports: Airport[];

    @ManyToOne(() => Country, (country) => country.cities, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    country: Country;
}
