import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, ObjectLiteral, Repository, SelectQueryBuilder} from "typeorm";
import {Car} from "./model/car.entity";
import {XUser} from "@michalrakus/x-nest-server-lib/xuser.entity";
import {CarOwner} from "./model/car-owner.entity";
import {Buffer} from "buffer";
import {CarOwnerFile} from "./model/car-owner-file.entity";

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

  async carOwnerSaveRow(carOwner: CarOwner, fileBuffer: Buffer, filename: string) {
    let carOwnerFile: CarOwnerFile = carOwner.carOwnerFile;
    // vzdy by mal existovat carOwnerFile, pre istotu vytvorime ak neexistuje (id = undefined znamena ze sa vygeneruje id-cko)
    // if (carOwnerFile === undefined) {
    //   carOwnerFile = {id: undefined, filename: undefined, data: undefined, carOwner: undefined};
    //   carOwner.carOwnerFile = carOwnerFile;
    // }
    // doplnime data, ktore chceme zapisat do DB
    carOwnerFile.filename = filename;
    carOwnerFile.data = fileBuffer;
    // zapiseme carOwner (vdaka cascade atributu na @OneToOne asociacii zapise aj carOwner.carOwnerFile)
    const repository: Repository<CarOwner> = this.dataSource.getRepository(CarOwner);
    await repository.save(carOwner);
  }

  async findCarOwnerFileById(carOwnerFileId: number): Promise<CarOwnerFile> {
    // const repository: Repository<CarOwnerFile> = this.dataSource.getRepository(CarOwnerFile);
    // const selectQueryBuilder : SelectQueryBuilder<unknown> = repository.createQueryBuilder(rootAlias);
    const selectQueryBuilder: SelectQueryBuilder<CarOwnerFile> = this.dataSource.createQueryBuilder(CarOwnerFile, 'carOwnerFile');
    // explicitne vytvarame SELECT klauzulu, lebo stlpec "data" mame oznaceny ako "select: false" - defaultne ho neselectujeme
    selectQueryBuilder
        .select('carOwnerFile.id')
        .addSelect('carOwnerFile.filename')
        .addSelect('carOwnerFile.data');
    selectQueryBuilder.whereInIds([carOwnerFileId]);
    return selectQueryBuilder.getOneOrFail();
  }
}
