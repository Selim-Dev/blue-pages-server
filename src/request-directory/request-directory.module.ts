import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { RequestDirectoryController } from './request-directory.controller';
import { RequestDirectoryService } from './request-directory.service';
import { RequestDirectory } from './request-directory.entity';
import { CitiesModule } from 'src/cities/cities.module';
import { DirectoryModule } from 'src/directories/directory.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestDirectory]),
    forwardRef(() => CitiesModule),
    forwardRef(() => DirectoryModule),
    forwardRef(() => AppModule),
    forwardRef(() => AuthModule)
    
  ],
  controllers: [RequestDirectoryController],
  exports: [RequestDirectoryService],
  providers: [RequestDirectoryService]
})
export class RequestDirectoryModule {}
