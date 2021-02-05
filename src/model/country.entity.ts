import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Country {

    @PrimaryGeneratedColumn({name: 'id_country'})
    idCountry: number;

    @Column({length: 8, nullable: false})
    code: string;

    @Column({length: 32, nullable: false})
    name: string;
}