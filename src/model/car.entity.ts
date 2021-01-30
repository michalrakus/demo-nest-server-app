import {Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import {Brand} from "./brand.entity";
import {Drive} from "./drive.entity";

@Entity()
export class Car {

    @PrimaryGeneratedColumn({name: 'id_car'})
    idCar: number;

    @Column({length: 255})
    vin: string;

    @Column({length: 255})
    brand: string;

    @Column({length: 255})
    year: string;

    @Column({nullable: true, length: 255})
    color: string;

    @Column({type: 'decimal', precision: 12, scale: 2, nullable: true})
    price: number;

    @Column({name: 'car_date', type: 'date', nullable: true})
    carDate: Date;

    @Column({name: 'car_datetime', type: 'datetime', nullable: true})
    carDatetime: Date;

    @ManyToOne(type => Brand)
    @JoinColumn({ name: "id_brand" })
    brandAssoc: Brand;

    @OneToMany(type => Drive, drive => drive.car, {cascade: ["insert", "update"]})
    driveList: Drive[];
}