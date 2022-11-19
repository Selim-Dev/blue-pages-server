import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AppModule } from 'src/app.module';
import { CitiesModule } from 'src/cities/cities.module';
import { DirectoryController } from './directory.controller';
import { Directory } from './directory.entity';
import { DirectoryService } from './directory.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Directory]),
    forwardRef(() => CitiesModule),
    forwardRef(() => AppModule),
    NestjsFormDataModule
  ],
  exports: [DirectoryService],
  controllers: [DirectoryController],
  providers: [DirectoryService]
})
export class DirectoryModule { }
