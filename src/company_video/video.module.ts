import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from 'src/companies/companies.module';
import { Video } from './video.entity';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    forwardRef(()=>CompaniesModule)
  ],
  controllers: [VideoController],
  providers: [VideoService],
	exports: [VideoService],
})
export class VideoModule { }
