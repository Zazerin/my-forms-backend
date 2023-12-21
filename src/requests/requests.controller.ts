import { Controller, Get, UseGuards, Post, Put, Body, Param, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
// import { google } from 'googleapis';

const { GoogleSpreadsheet } = require('google-spreadsheet');

const scopes = [
  'https://www.googleapis.com/auth/spreadsheets'
];
@Controller('spreadsheet')
export class RequestsController {

  constructor(private configService: ConfigService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getSpreadsheet(@Param() params) {

    const doc = new GoogleSpreadsheet(params.id);

    await doc.useServiceAccountAuth({
      client_email: this.configService.get<string>('googleApi.account'),
      private_key: this.configService.get<string>('googleApi.key').replace(/\\n/g, "\n"),
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    if(rows.length) {
      const headers = rows[0]._sheet.headerValues;
      const rowsData = rows.map(r => {
        const rowData = {}
        headers.forEach(key => {
          rowData[key] = r[key]
        });
        return rowData;
      });

      return { headers, rowsData };
    }

    return { headers: [], rowsData: [] }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  addSpreadsheet(@Request() req) {
    return [];
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/row/:rowId')
  async updateSpreadsheet(@Param() { id, rowId }, @Body() { columnKey, value }) {
    const doc = new GoogleSpreadsheet(id);

    await doc.useServiceAccountAuth({
      client_email: this.configService.get<string>('googleApi.account'),
      private_key: this.configService.get<string>('googleApi.key').replace(/\\n/g, "\n"),
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    if(rows[rowId]) {
      rows[rowId][columnKey] = value;
      await rows[rowId].save();

      return { result: "success" };
    }

    return { result: "unsuccess" };
  }

  @UseGuards(JwtAuthGuard)
  @Post('give-products')
  giveProducts(@Request() req) {
    return [];
  }

  @UseGuards(JwtAuthGuard)
  @Get('phones')
  getPhones(@Request() req) {
    return [];
  }

  @UseGuards(JwtAuthGuard)
  @Get('addresses')
  getAddresses(@Request() req) {
    return [];
  }

  @UseGuards(JwtAuthGuard)
  @Get('fullnames')
  getFullnames(@Request() req) {
    return [];
  }
}
