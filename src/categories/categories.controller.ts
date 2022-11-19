import { RolesMeta } from './../auth/roles.decorator';
import { RolesGuard } from './../auth/guards/roles.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, SetMetadata, UploadedFiles, UseGuards, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import { UserDecorator } from '../auth/user.decorator';
import { User } from '../auth/models/user.entity';
import { CategoryDto } from './dto/category.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { Roles } from '../auth/roles.enum';
import { FilterCategoryDto } from './dto/filterCategory.dto';

@Controller('categories')
export class CategoriesController {

  constructor(private categoryService: CategoriesService) { }

  // get all category 
  @Get()
  async findAll(@Query() filter: FilterCategoryDto): Promise<any> {
    return this.categoryService.findAll(filter);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number, @UserDecorator() user: User): Promise<any> {
    return this.categoryService.findOne(user, id);
  }


  @Post()
  @RolesMeta(Roles.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async create(@Body(ValidationPipe) category: CategoryDto): Promise<any> {
    return this.categoryService.create(category);
  }
  //  or
  // @UseInterceptors(
  //   FilesInterceptor('files[]', 20, {
  //     fileFilter: pngFileFilter,
  //   })
  // )



  @Put('/:id')
  @RolesMeta(Roles.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async update(@Body(ValidationPipe) category: UpdateCategoryDto, @Param('id') id: number, @UserDecorator() user: User): Promise<any> {
    return this.categoryService.updateCat(category, id, user);
  }
  @Patch('increase-views/:id')
  @RolesMeta(Roles.ADMIN, Roles.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async increaseCategoryViews(@Param('id') id: number): Promise<any> {
    return this.categoryService.increaseCategoryViews(id);
  }

  @Delete('/:id')
  @RolesMeta(Roles.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async delete(@Param('id') id: number, @UserDecorator() user: User): Promise<any> {
    return this.categoryService.deleteCat(id, user)
  }


}
