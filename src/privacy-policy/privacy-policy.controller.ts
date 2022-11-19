import { Body, Controller, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesMeta } from 'src/auth/roles.decorator';
import { Roles } from 'src/auth/roles.enum';
import { PrivacyPolicyDto } from './dto/privacy-policy.dto';
import { UpdatePrivacyPolicyDto } from './dto/update-privacy-policy.dto';
import { PrivacyPolicyService } from './privacy-policy.service';

@Controller('privacy-policy')
export class PrivacyPolicyController {
    constructor(private privacyPolicyService: PrivacyPolicyService) { }

    @Get()
    @RolesMeta(Roles.ADMIN, Roles.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async get(): Promise<any> {
        return this.privacyPolicyService.get();
    }


    @Post()
    @RolesMeta(Roles.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async create(@Body(ValidationPipe) privacyPolicyDto: PrivacyPolicyDto): Promise<any> {
        return this.privacyPolicyService.create(privacyPolicyDto);
    }

    @Put('/:id')
    @RolesMeta(Roles.ADMIN, Roles.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async update(@Body(ValidationPipe) updatePrivacyPolicyDto: UpdatePrivacyPolicyDto, @Param('id') id: number): Promise<any> {
        return this.privacyPolicyService.update(updatePrivacyPolicyDto, id);
    }


}
