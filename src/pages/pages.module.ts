import { Page } from './page.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';

@Module({
	imports: [
    TypeOrmModule.forFeature([Page]),
  ],
  controllers: [PagesController],
  providers: [PagesService]
})
export class PagesModule {}

