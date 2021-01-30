import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Country {

    @PrimaryGeneratedColumn({name: 'id_country'})
    idCountry: number;

    @Column({length: 255})
    code: string;

    @Column({length: 255})
    name: string;
}