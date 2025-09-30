import { Airport } from "../../airaport/entities/airaport.entity";
import { City } from "../../city/entities/city.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('countries')
export class Country {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @Column({ type: 'varchar', length: 3, unique: true })
    code: string;

    @OneToMany(() => Airport, (airport) => airport.country)
    airports: Airport[];

    @OneToMany(() => City, (city) => city.country)
    cities: City[];

}
