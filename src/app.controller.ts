import {Body, Controller, Headers, Get, Post, UseInterceptors, UploadedFile, Res, HttpStatus} from '@nestjs/common';
import { AppService } from './app.service';
import {XLibService} from "@michalrakus/x-nest-server-lib/lib/services/x-lib.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {Response} from 'express';
import {ImportResponse} from "@michalrakus/x-nest-server-lib/ExportImportParam";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly xLibService: XLibService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('importCarCsv')
  @UseInterceptors(FileInterceptor('fileField'))
  async upload(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Headers('Authorization') headerAuth: string, @Res() res: Response) {
    // musime dat await, lebo vo vnutri je tiez await (kod "za" await v xLibService.checkAuthentication by zbehol az po zbehnuti celej tejto metody, ak by tu nebol await
    await this.xLibService.checkAuthentication(headerAuth);

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

}
