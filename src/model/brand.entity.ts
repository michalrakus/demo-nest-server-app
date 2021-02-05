import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Brand {

    @PrimaryGeneratedColumn({name: 'id_brand'})
    idBrand: number;

    @Column({length: 32, nullable: false})
    brand: string;
}