import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { Setting } from './setting.entity';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    TypeOrmModule.forFeature([Setting]),
    forwardRef(() => AppModule),
		NestjsFormDataModule
  ],
  controllers: [SettingsController],
  providers: [SettingsService]
})
export class SettingsModule { }
