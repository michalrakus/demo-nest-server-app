import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Country} from "./country.entity";
import {Car} from "./car.entity";

@Entity()
export class Drive {

    @PrimaryGeneratedColumn({name: 'id_drive'})
    idDrive: number;

    @Column({name: 'city_from', length: 32, nullable: false})
    cityFrom: string;

    @Column({name: 'city_to', length: 32, nullable: true})
    cityTo: string;

    @Column({nullable: true})
    km: number;

    @Column({name: 'fuel_price', type: 'decimal', precision: 12, scale: 2, nullable: true})
    fuelPrice: number;

    @Column({name: 'drive_date', type: 'date', nullable: true})
    driveDate: Date;

    @Column({name: 'drive_datetime', type: 'datetime', nullable: true})
    driveDatetime: Date;

    @Column({name: 'drive_boolean', nullable: true})
    driveBoolean: boolean;

    @ManyToOne(type => Car, car => car.driveList, {nullable: false})
    @JoinColumn({name: "id_car"})
    car: Car;

    @ManyToOne(type => Country, {nullable: true})
    @JoinColumn({name: "id_country"})
    country: Country;
}