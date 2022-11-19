import { forwardRef, Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    forwardRef(() => AppModule)
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController]
})
export class CategoriesModule { }
