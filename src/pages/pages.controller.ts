import { UpdatePageDto } from './dto/update-page.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.enum';
import { PagesService } from './pages.service';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { RolesMeta } from 'src/auth/roles.decorator';
import { CreatePageDto } from './dto/create-page.dto';

@Controller('pages')
export class PagesController {
	constructor(private pagesService:PagesService ) { }

    // get all video 
    @Get()
    async findAll(): Promise<any> {
        return this.pagesService.findAll();
    }

    @Get('/:id')
    async findOne(@Param('id') id: number,): Promise<any> {
        return this.pagesService.findOne(id);
    }

    @Post()
    @RolesMeta(Roles.ADMIN, Roles.SUPERVISOR)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async create(@Body(ValidationPipe) createPageDto: CreatePageDto): Promise<any> {
        return this.pagesService.create(createPageDto);
    }

    @Put('/:id')
    @RolesMeta(Roles.ADMIN, Roles.SUPERVISOR)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async update(@Body(ValidationPipe) updatePageDto: UpdatePageDto, @Param('id') id: number,): Promise<any> {
        return this.pagesService.update(updatePageDto, id);
    }

    @Delete('/:id')
    @RolesMeta(Roles.ADMIN, Roles.SUPERVISOR)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async delete(@Param('id') id: number,): Promise<any> {
        return this.pagesService.delete(id)
    }
}
