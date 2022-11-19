import { RolesMeta } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, SetMetadata, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { PhonesService } from './phones.service';
import { AuthGuard } from '@nestjs/passport';
import { PhoneDto } from './dto/phone.dto';
import { UpdatePhoneDto } from './dto/updatePhone.dto';
import { Roles } from '../auth/roles.enum';
import { FilterPhoneDto } from './dto/filter.dto';


@Controller('phone')
@UseGuards(AuthGuard('jwt'))
export class PhonesController {
    constructor(private phoneService: PhonesService) { }

    // get all phone 
    @Get()
    async findAll(@Query() filterPhoneDto: FilterPhoneDto): Promise<any> {
        return this.phoneService.findAll(filterPhoneDto);
    }

    @Get('/:id')
    async findOne(@Param('id') id: number,): Promise<any> {
        return this.phoneService.findOne(id);
    }

    @Post()
    @RolesMeta(Roles.ADMIN, Roles.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async create(@Body(ValidationPipe) phoneDto: PhoneDto,): Promise<any> {
        return this.phoneService.create(phoneDto);
    }

    @Put('/:id')
    @RolesMeta(Roles.ADMIN, Roles.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async update(@Body(ValidationPipe) phone: UpdatePhoneDto, @Param('id') id: number,): Promise<any> {
        return this.phoneService.update(phone, id);
    }

    @Delete('/:id')
    @RolesMeta(Roles.ADMIN, Roles.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async delete(@Param('id') id: number,): Promise<any> {
        return this.phoneService.delete(id)
    }

}
