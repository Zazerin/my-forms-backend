import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RequestsController } from './requests/requests.controller';
import { GdriveService } from './gdrive/gdrive.service';
import { GdriveController } from './gdrive/gdrive.controller';
import configuration from './config/configuration';

@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true
  }), AuthModule, UsersModule],
  controllers: [AppController, RequestsController, GdriveController],
  providers: [AppService, GdriveService],
})
export class AppModule {}
