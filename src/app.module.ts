import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {XLibModule} from '@michalrakus/x-nest-server-lib/x-lib.module';
import {TypeOrmModule, TypeOrmModuleOptions} from "@nestjs/typeorm";
import {Car} from "./model/car.entity";
import {Brand} from "./model/brand.entity";
import {Country} from "./model/country.entity";
import {Drive} from "./model/drive.entity";
import {XUser} from "@michalrakus/x-nest-server-lib/xuser.entity";
import {XBrowseMeta} from "@michalrakus/x-nest-server-lib/x-browse-meta.entity";
import {XColumnMeta} from "@michalrakus/x-nest-server-lib/x-column-meta.entity";

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
  entities: [XUser, XBrowseMeta, XColumnMeta, Car, Brand, Drive, Country],
  synchronize: false,
  logging: true
};

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmModuleOptions), XLibModule.forRoot(typeOrmModuleOptions)],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
