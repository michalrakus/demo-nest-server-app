import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Buffer} from "buffer";
import {CarOwner} from "./car-owner.entity";

@Entity()
export class CarOwnerFile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 256, nullable: false})
    filename: string;

    // select: false - nechceme selectovat stlpec lebo obsahuje vela dat
    @Column({type: "mediumblob", nullable: false, select: false})
    data: Buffer;

    @OneToOne(() => CarOwner, (carOwner) => carOwner.carOwnerFile, {nullable: false})
    @JoinColumn({name: "car_owner_id"})
    carOwner: CarOwner;
}