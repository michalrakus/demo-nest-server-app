import {Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import {Brand} from "./brand.entity";
import {Drive} from "./drive.entity";

@Entity()
export class Car {

    @PrimaryGeneratedColumn({name: 'id_car'})
    idCar: number;

    @Column({length: 8, nullable: false})
    vin: string;

    @Column({length: 32, nullable: true})
    brand: string;

    @Column({width: 4, nullable: true})
    year: number;

    @Column({length: 32, nullable: true})
    color: string;

    @Column({type: 'decimal', precision: 12, scale: 2, nullable: true})
    price: number;

    @Column({name: 'car_date', type: 'date', nullable: true})
    carDate: Date;

    @Column({name: 'car_datetime', type: 'datetime', nullable: true})
    carDatetime: Date;

    @Column({name: 'car_boolean', nullable: true})
    carBoolean: boolean;

    @Column({length: 512, nullable: true})
    comment: string;

    @ManyToOne(type => Brand, {nullable: true})
    @JoinColumn({ name: "id_brand" })
    brandAssoc: Brand;

    @OneToMany(type => Drive, drive => drive.car, {cascade: ["insert", "update", "remove"]})
    driveList: Drive[];
}