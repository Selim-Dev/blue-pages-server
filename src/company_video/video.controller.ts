import { RolesMeta } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, SetMetadata, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { VideoService } from './video.service';
import { AuthGuard } from '@nestjs/passport';
import { VideoDto } from './dto/video.dto';
import { UpdateVideoDto } from './dto/update_video.dto';
import { Roles } from '../auth/roles.enum';
import { FilterVideoDto } from './dto/filter.dto';


@Controller('video')
@UseGuards(AuthGuard('jwt'))
export class VideoController {
    constructor(private videoService: VideoService) { }

    // get all video 
    @Get()
    async findAll(@Query() filtervideoDto: FilterVideoDto): Promise<any> {
        return this.videoService.findAll(filtervideoDto);
    }

    @Get('/:id')
    async findOne(@Param('id') id: number,): Promise<any> {
        return this.videoService.findOne(id);
    }

    @Post()
    @RolesMeta(Roles.ADMIN, Roles.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async create(@Body(ValidationPipe) videoDto: VideoDto,): Promise<any> {
        return this.videoService.create(videoDto);
    }

    @Put('/:id')
    @RolesMeta(Roles.ADMIN, Roles.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async update(@Body(ValidationPipe) video: UpdateVideoDto, @Param('id') id: number,): Promise<any> {
        return this.videoService.update(video, id);
    }

    @Delete('/:id')
    @RolesMeta(Roles.ADMIN, Roles.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async delete(@Param('id') id: number,): Promise<any> {
        return this.videoService.delete(id)
    }

}
