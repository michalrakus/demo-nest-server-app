import {
  Body,
  Controller,
  Headers,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
  UseGuards,
  Request, UseFilters, ForbiddenException, StreamableFile
} from '@nestjs/common';
import { AppService } from './app.service';
import {XLibService} from "@michalrakus/x-nest-server-lib/lib/services/x-lib.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {Response} from 'express';
import {ImportResponse} from "@michalrakus/x-nest-server-lib/ExportImportParam";
import {XUser} from "@michalrakus/x-nest-server-lib/xuser.entity";
import {Public} from "@michalrakus/x-nest-server-lib/public";
import {FindParam} from "@michalrakus/x-nest-server-lib/lib/serverApi/FindParam";
import {FindResult} from "@michalrakus/x-nest-server-lib/lib/serverApi/FindResult";
import {XLazyDataTableService} from "@michalrakus/x-nest-server-lib/lib/services/x-lazy-data-table.service";
import {CarOwner} from "./model/car-owner.entity";
import {CarOwnerFile} from "./model/car-owner-file.entity";
import {Readable} from 'stream';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly xLibService: XLibService,
              private readonly xLazyDataTableService: XLazyDataTableService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('testDB')
  async testDB(): Promise<string> {
    return await this.appService.testDB();
  }

  @Get('testDBRep')
  async testDBRep(): Promise<string> {
    return await this.appService.testDBRep();
  }

  @Public()
  @Post('testService')
  testService(@Request() req): any {
    console.log("req.user = " + JSON.stringify(req.user));
    // if (1 === 1) {
    //   throw `********* Pokusny error **************`;
    //   //throw new ForbiddenException();
    // }
    return {x: "value1", y: "value2", reqUser: req.user};
  }

  @Public()
  @Post('lazyDataTableFindRowsTest')
  async lazyDataTableFindRowsTest(@Body() body: FindParam): Promise<FindResult> {
      const findResult: FindResult = await this.xLazyDataTableService.findRows(body);
    return findResult;
  }

  // @Get('testDBLib')
  // async testDBLib(): Promise<string> {
  //   const userList: XUser[] = await this.xLibService.findRows({entity: 'XUser'});
  //   let res : string = "";
  //   for (const user of userList) {
  //     res += '<div>' + user.idXUser + ' ' + user.username + '</div>';
  //   }
  //   return res;
  // }

  // {dest: 'uploads/'} - zapisuje subor na disk do adresara 'uploads/' (root adresar projektu),
  // po precitani suboru temp subor zmazeme (pozri kod)
  // poznamka: funguje aj {dest: 'C:\\MisoRakus2\\temp\\uploads\\'}
  @Post('importCarCsv')
  @UseInterceptors(FileInterceptor('fileField', {dest: 'uploads/'}))
  async upload(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {

    //console.log(typeof body.jsonField); // vrati string
    console.log(body.jsonField);
    console.log(file);

    // v pripade ak pouzivame ukladanie do pamete (MemoryStorage (default))
    //const multerText = Buffer.from(file.buffer).toString("utf8");
    //console.log(multerText);

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    res.charset = "utf8"; // default encoding

    let lineCount = 0;

    // ak pouzivame subor:
    const lineReader = require('line-reader');
    lineReader.eachLine(file.path, {encoding: 'utf8'}, function(line, last) {
        console.log(line);
        lineCount++;
        if (last) {
          res.status(HttpStatus.OK);
          const importResponse: ImportResponse = {ok: true, rowsImported: lineCount};
          res.send(JSON.stringify(importResponse));

          // remove uploaded file
          const fs = require('fs');
          fs.unlink(file.path, (err) => {
            if (err) {
              console.error(err);
            }
            //file removed
          });
        }
    });
  }

  // vo FileInterceptor nie je uvedeny adresar, uploadovany subor sa uklada do pamete (do file.buffer)
  @Post('carOwnerSaveRow')
  @UseInterceptors(FileInterceptor('fileField'))
  async carOwnerSaveRow(@Body() body: any, @UploadedFile() file: Express.Multer.File/*, @Res() res: Response*/): Promise<any> {
    // body.jsonField je string, treba ho explicitne konvertovat na objekt, ani ked specifikujem typ pre "body" tak nefunguje
    const carOwner: CarOwner = JSON.parse(body.jsonField);
    console.log(file);
    await this.appService.carOwnerSaveRow(carOwner, file.buffer, file.originalname);
    return {};
  }

  @Post('carOwnerDownloadFile')
  async carOwnerDownloadFile(@Body() body: {carOwnerFileId: number;}/*, @Res({ passthrough: true }) response: Response*/) {

    const carOwnerFile: CarOwnerFile = await this.appService.findCarOwnerFileById(body.carOwnerFileId);

    const stream = Readable.from(carOwnerFile.data);

    // ciel tohto je pri ukladani v browseri zapisat subor pod spravnym nazvom
    // nefungovalo mi to, musel som nazov suboru zapisat na klientovi
    // response.set({
    //   'Content-Disposition': `inline; filename="${carOwnerFile.filename}"`,
    //   'Content-Type': 'image'
    // })

    return new StreamableFile(stream);
  }
}
