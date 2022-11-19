import { IncreaseViewsDto } from './dto/increase-views.dto';
import { Body, Controller, Get, Param, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesMeta } from 'src/auth/roles.decorator';
import { Roles } from 'src/auth/roles.enum';
import { SettingDto } from './dto/setting.dto';
import { UpdateSettingDto } from './dto/updateSettings.dto';
import { SettingsService } from './settings.service';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('setting')
export class SettingsController {
    constructor(private settingsService: SettingsService) { }


    @Get()
    async get(): Promise<any> {
        return this.settingsService.get();
    }

    @Post()
    @RolesMeta(Roles.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @FormDataRequest()
    async create(@Body(ValidationPipe) settingDto: SettingDto): Promise<any> {
        return this.settingsService.create(settingDto);
    }

    @Put()
    @RolesMeta(Roles.ADMIN, Roles.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @FormDataRequest()
    async update(@Body(ValidationPipe) updateSettingDto: UpdateSettingDto): Promise<any> {
        return this.settingsService.update(updateSettingDto);
    }

    @Patch('/increase-views')
    async increaseViews(@Body(ValidationPipe) increaseViewsDto: IncreaseViewsDto): Promise<any> {
        return this.settingsService.increaseViews(increaseViewsDto);
    }


}
