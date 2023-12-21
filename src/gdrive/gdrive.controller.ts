import { Controller, Get, UseGuards, Post, Put, Request, Param, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { Readable } from 'stream';

const scopes = [
  'https://www.googleapis.com/auth/drive'
];

@Controller('gdrive')
export class GdriveController {

  private drive: any;

  constructor(private configService: ConfigService) {
    const auth = new google.auth.JWT(
      this.configService.get<string>('googleApi.account'),
      null,
      this.configService.get<string>('googleApi.key').replace(/\\n/g, "\n"),
      scopes
    );
    this.drive = google.drive({ version: "v3", auth });
  }

  @UseGuards(JwtAuthGuard)
  @Get('files')
  async getFiles(@Request() req) {
    const files = await new Promise((resolve, rej) => {
        this.drive.files.list({
          fields: 'files(id, name, parents, mimeType, capabilities)',
        }, (err, res) => {
        if (err) {
          rej(err);
          return;
        };
        const files = res.data.files;
        resolve(files);
      });
    });

    return { files };
  }

  @UseGuards(JwtAuthGuard)
  @Post('files')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {

      const fileMetadata = {
        'name': body.filename,
        'parents': body.folders,
      };
      const media = {
        mimeType: file.mimetype,
        body: Readable.from(file.buffer),
      };
    
      try {
        const file = await this.drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: 'id',
        });
        return { fileID: file.data.id };
      } catch (err) {
        // TODO(developer) - Handle error
        throw err;
      }

      return 'unhandled error'
  }

  @UseGuards(JwtAuthGuard)
  @Put('files')
  async updateFile(@Request() req) {
      try {
        // Retrieve the existing parents to remove
        const file = await this.drive.files.get({
          fileId: '1lcFqhD0RTGxyhB_5qHA_qdGiNSLVIwqf',
          fields: 'parents',
        });
    
        // Move the file to the new folder
        const previousParents = file.data.parents.map(function(parent) {
          return parent.id;
        }).join(',');
        const files = await this.drive.files.update({
          fileId: '1lcFqhD0RTGxyhB_5qHA_qdGiNSLVIwqf',
          addParents: '1--DeigacW2s971YM1wPm2v369exYEpRg',
          removeParents: previousParents,
          fields: 'id, parents',
        });
        return files.status;
      } catch (err) {
        // TODO(developer) - Handle error
        throw err;
      }
  }
}
