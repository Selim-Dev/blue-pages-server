import { Roles } from '../auth/roles.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDecorator } from '../auth/user.decorator';
import { User } from '../auth/models/user.entity';
import { DirectoryService } from './directory.service';
import { DirectoryDto } from './dto/directory.dto';
import { UpdateDirectoryDto } from './dto/updateDirectory.dto';
import { RolesMeta } from '../auth/roles.decorator';
import { FilterDirectoryDto } from './dto/filter.dto';
import { FormDataRequest } from 'nestjs-form-data';


@Controller('directory')
@UseGuards(AuthGuard('jwt'))
export class DirectoryController {

  constructor(private directoryService: DirectoryService) { }

  // get all directory 
  @Get()
  async findAll(@Query() filterDto: FilterDirectoryDto): Promise<any> {
    return this.directoryService.findAll(filterDto);
  }

  @Get('/:id')
  @RolesMeta(Roles.ADMIN, Roles.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findOne(@Param('id') id: number): Promise<any> {
    return this.directoryService.findOne(id);
  }

  @Post()
  @RolesMeta(Roles.ADMIN, )
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @FormDataRequest()
  async create(@Body(ValidationPipe) directory: DirectoryDto): Promise<any> {
    return this.directoryService.create(directory);
  }

  @Put('/:id')
  @RolesMeta(Roles.ADMIN)
  @FormDataRequest()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async update(@Body(ValidationPipe) directory: UpdateDirectoryDto, @Param('id') id: number): Promise<any> {
    return this.directoryService.update(directory, id);
  }

  @Delete('/:id')
  @RolesMeta(Roles.ADMIN, )
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async delete(@Param('id') id: number): Promise<any> {
    return this.directoryService.delete(id)
  }



}
