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
  Request, UseFilters, ForbiddenException
} from '@nestjs/common';
import { AppService } from './app.service';
import {XLibService} from "@michalrakus/x-nest-server-lib/lib/services/x-lib.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {Response} from 'express';
import {ImportResponse} from "@michalrakus/x-nest-server-lib/ExportImportParam";
import {XUser} from "@michalrakus/x-nest-server-lib/xuser.entity";
import {Public} from "@michalrakus/x-nest-server-lib/public";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService
              /*private readonly xLibService: XLibService*/) {}

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

  // @Get('testDBLib')
  // async testDBLib(): Promise<string> {
  //   const userList: XUser[] = await this.xLibService.findRows({entity: 'XUser'});
  //   let res : string = "";
  //   for (const user of userList) {
  //     res += '<div>' + user.idXUser + ' ' + user.username + '</div>';
  //   }
  //   return res;
  // }

  @Post('importCarCsv')
  @UseInterceptors(FileInterceptor('fileField'))
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

}
