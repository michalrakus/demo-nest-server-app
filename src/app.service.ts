import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, ObjectLiteral, Repository, SelectQueryBuilder} from "typeorm";
import {Car} from "./model/car.entity";
import {XUser} from "@michalrakus/x-nest-server-lib/xuser.entity";

@Injectable()
export class AppService {
  constructor(
      @InjectRepository(Car)
      private carRepository: Repository<Car>, // for test - da sa injektnut len ak v AppModule v "imports" mame TypeOrmModule.forFeature(entities)
      private dataSource: DataSource
  ) {}

  getHello(): string {
    return 'Hello World! Slape to!';
  }

  async testDB(): Promise<string> {
    const cars: Car[] = await this.carRepository.find();
    let res : string = "";
    for (const car of cars) {
      res += '<div>' + car.idCar + ' ' + car.brand + '</div>';
    }
    return res;
  }

  async testDBRep(): Promise<string> {

    let res : string = "";
    for (const entityMetadata of this.dataSource.entityMetadatas) {
      // poloziek columnMetadata je strasne vela, asi tam maju bug
      let columns = "";
      for (const columnMetadata of entityMetadata.columns) {
        columns += columns + columnMetadata.propertyName + ", ";
      }
      res += '<div>' + entityMetadata.name + ': ' + columns + '</div>';
    }

    const repository = this.dataSource.getRepository("Car");
    const selectQueryBuilder: SelectQueryBuilder<ObjectLiteral> = repository.createQueryBuilder();
    let rowList: any[] = await selectQueryBuilder.getMany();
    for (const row of rowList) {
      res += '<div>' + JSON.stringify(row) + '</div>';
    }
    return res;
  }
}
