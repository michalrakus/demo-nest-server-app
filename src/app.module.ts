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
import {MulterModule} from "@nestjs/platform-express";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {AuthModule} from "@michalrakus/x-nest-server-lib/auth.module";
import {APP_GUARD} from "@nestjs/core";
import {ConfigModule} from "@nestjs/config";
import {JwtAuthGuard} from "@michalrakus/x-nest-server-lib/jwt-auth.guard";
import {CarOwnerFile} from "./model/car-owner-file.entity";
import {CarOwner} from "./model/car-owner.entity";
import {XEnvVar} from "@michalrakus/x-nest-server-lib/XEnvVars";
import {XUtils} from "@michalrakus/x-nest-server-lib/XUtils";
import {XAdvancedConsoleLogger} from "@michalrakus/x-nest-server-lib/XAdvancedConsoleLogger";

const entities: EntityClassOrSchema[] = [XUser, XBrowseMeta, XColumnMeta, Car, Brand, Drive, Country, CarOwner, CarOwnerFile];

// kedze metoda pouziva environment variables, musi byt zavolana az po inicializacii modulu ConfigModule
function createTypeOrmModuleOptions(entities: EntityClassOrSchema[]): TypeOrmModuleOptions {

  const {parseUri} = require('mysql-parse')
  // let connectionUrl = process.env.JAWSDB_URL; // pouzivane na heroku
  // if (connectionUrl == null || connectionUrl == '') {
  //   connectionUrl = process.env.X_DATABASE_URL;
  // }
  let connectionUrl: string = XUtils.getEnvVarValue(XEnvVar.X_DATABASE_URL);
  const connectionOptions = parseUri(connectionUrl);

  const typeOrmModuleOptions: TypeOrmModuleOptions = {
    type: 'mysql',
    host: connectionOptions.host,
    port: connectionOptions.port,
    username: connectionOptions.user,
    password: connectionOptions.password,
    database: connectionOptions.database,
    entities: entities,
    synchronize: false,
    // logging: true sme nahradili custom loggerom - rozumne loguje parameter typu Buffer
    //logging: true,
    logger: new XAdvancedConsoleLogger(XUtils.getEnvVarValueBoolean(XEnvVar.X_LOG_SQL))
  };
  return typeOrmModuleOptions;
}

// ConfigModule.forRoot nacitava subor .env, isGlobal:true spristupnuje environment variables v kazdom module
// TypeOrmModule.forFeature(entities) je potrebny aby sme mohli injektovat Repository (vid carRepository v AppService)
// TypeOrmModule.forRoot(typeOrmModuleOptions), TypeOrmModule.forFeature(entities) mozme presunut aj do XLibModule, zatial ich nechame tu
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot(createTypeOrmModuleOptions(entities)),
    TypeOrmModule.forFeature(entities),
    XLibModule.forRoot(),
    AuthModule,
    MulterModule.register(/*{dest: 'uploads/'}*/) // globalne nastavenie ako spracovavat subory, zatial nastavujeme na metodach controllera
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
  exports: [TypeOrmModule] // zevraj treba aby bola DB pristupna vo vsetkych moduloch, funguje vsak aj bez tohto
})
export class AppModule {}
