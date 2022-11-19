import { UpdateOfferVideoDto } from './dto/update_video.dto';
import { OfferVideoDto } from './dto/video.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.enum';
import { FilterOfferVideoDto } from './dto/filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { OfferVideosService } from './offer-videos.service';
import { RolesMeta } from 'src/auth/roles.decorator';

@Controller('offerVideos')
@UseGuards(AuthGuard('jwt'))
export class OfferVideosController {
	constructor(private videoService: OfferVideosService) { }

	// get all video 
	@Get()
	async findAll(@Query() filtervideoDto: FilterOfferVideoDto): Promise<any> {
			return this.videoService.findAll(filtervideoDto);
	}

	@Get('/:id')
	async findOne(@Param('id') id: number,): Promise<any> {
			return this.videoService.findOne(id);
	}

	@Post()
	@RolesMeta(Roles.ADMIN, Roles.USER)
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	async create(@Body(ValidationPipe) videoDto: OfferVideoDto,): Promise<any> {
			return this.videoService.create(videoDto);
	}

	@Put('/:id')
	@RolesMeta(Roles.ADMIN, Roles.USER)
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	async update(@Body(ValidationPipe) video: UpdateOfferVideoDto, @Param('id') id: number,): Promise<any> {
			return this.videoService.update(video, id);
	}

	@Delete('/:id')
	@RolesMeta(Roles.ADMIN, Roles.USER)
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	async delete(@Param('id') id: number,): Promise<any> {
			return this.videoService.delete(id)
	}
}
