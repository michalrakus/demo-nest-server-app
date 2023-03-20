import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {CarOwnerFile} from "./car-owner-file.entity";

@Entity()
export class CarOwner {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 32, nullable: true})
    name: string;

    @Column({length: 32, nullable: false})
    surname: string;

    @OneToOne(() => CarOwnerFile, (carOwnerFile) => carOwnerFile.carOwner, {cascade: ["insert", "update", "remove"]})
    carOwnerFile: CarOwnerFile;
}