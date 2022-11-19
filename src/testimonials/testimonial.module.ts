import { NestjsFormDataModule } from 'nestjs-form-data';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { TestimonialController } from './testimonial.controller';
import { TestimonialService } from './testimonial.service';
import { Testimonial } from './testimonial.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Testimonial]),
    forwardRef(() => AppModule),
		NestjsFormDataModule
  ],
  controllers: [TestimonialController],
  exports: [TestimonialService],
  providers: [TestimonialService]
})
export class TestimonialModule {}
