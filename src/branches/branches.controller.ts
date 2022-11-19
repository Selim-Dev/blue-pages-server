import { Roles } from './../auth/roles.enum';
import { RolesGuard } from './../auth/guards/roles.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDecorator } from '../auth/user.decorator';
import { User } from '../auth/models/user.entity';
import { BranchesService } from './branches.service';
import { BranchesDto } from './dto/branches.dto';
import { UpdateBranchesDto } from './dto/updateBranches.dto';
import { RolesMeta } from '../auth/roles.decorator';
import { FilterBranchesDto } from './dto/filter.dto';


@Controller('branch')

export class BranchesController {

  constructor(private branchesService: BranchesService) { }

  // get all branches 
  @Get()
  async findAll(@Query() filterDto: FilterBranchesDto): Promise<any> {
    return this.branchesService.findAll(filterDto);
  }

  @Get('/:id')
  @RolesMeta(Roles.ADMIN, Roles.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findOne(@Param('id') id: number): Promise<any> {
    return this.branchesService.findOne(id);
  }

  @Post()
  @RolesMeta(Roles.ADMIN, Roles.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async create(@Body(ValidationPipe) branches: BranchesDto, @UserDecorator() user: User): Promise<any> {
    return this.branchesService.create(branches);
  }

  @Put('/:id')
  @RolesMeta(Roles.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async update(@Body(ValidationPipe) branches: UpdateBranchesDto, @Param('id') id: number): Promise<any> {
    return this.branchesService.update(branches, id);
  }

  @Delete('/:id')
  @RolesMeta(Roles.ADMIN, Roles.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async delete(@Param('id') id: number): Promise<any> {
    return this.branchesService.delete(id)
  }



}
