import { Roles } from '../auth/roles.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Body, Controller, Delete, Query, Get, Param, Post, Put, UseGuards, UseInterceptors, ValidationPipe, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TestimonialService } from './testimonial.service';
import { TestimonialsDto } from './dto/testimonial.dto';
import { UpdateTestimonialDto } from './dto/updateTestimonial.dto';
import { RolesMeta } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('testimonial')
export class TestimonialController {

  constructor(private testimonialService: TestimonialService) { }

  // get all testimonial 
  @Get()
  async findAll(): Promise<any> {
    return this.testimonialService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.testimonialService.findOne(id);
  }

  @Post()
  @RolesMeta(Roles.ADMIN)
 @UseGuards(AuthGuard('jwt'), RolesGuard)
  
	@FormDataRequest()
  async create(@Body(ValidationPipe) testimonial: TestimonialsDto): Promise<any> {
    return this.testimonialService.create(testimonial);
  }

  @Put('/:id')
  @RolesMeta(Roles.ADMIN)
 @UseGuards(AuthGuard('jwt'), RolesGuard)
	@FormDataRequest()
  async update(@Body(ValidationPipe) testimonial: UpdateTestimonialDto, @Param('id') id: number): Promise<any> {
    return this.testimonialService.update(testimonial, id);
  }

  @Delete('/:id')
  @RolesMeta(Roles.ADMIN)
 @UseGuards(AuthGuard('jwt'), RolesGuard)
  async delete(@Param('id') id: number): Promise<any> {
      return this.testimonialService.delete(id)
  }



}
