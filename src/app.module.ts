import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {Pokus1Module} from '@michalrakus/x-nest-server-lib/pokus1.module';
import {TypeOrmModule, TypeOrmModuleOptions} from "@nestjs/typeorm";
import {Car} from "./pokus1/car.entity";
import {Brand} from "./pokus1/brand.entity";
import {Country} from "./pokus1/country.entity";
import {Drive} from "./pokus1/drive.entity";
import {XUser} from "@michalrakus/x-nest-server-lib/xuser.entity";

const {parseUri} = require('mysql-parse')
let connectionUrl = process.env.JAWSDB_URL; // pouzivane na heroku
if (connectionUrl == null || connectionUrl == '') {
    connectionUrl = 'mysql://root:@localhost:3306/pokusdb';
}
const connectionOptions = parseUri(connectionUrl);

const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: connectionOptions.host,
  port: connectionOptions.port,
  username: connectionOptions.user,
  password: connectionOptions.password,
  database: connectionOptions.database,
  entities: [XUser, Car, Brand, Drive, Country],
  synchronize: false,
  logging: true
};

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmModuleOptions), Pokus1Module.forRoot(typeOrmModuleOptions)],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
