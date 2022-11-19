import { OfferIdsDto } from './dto/offer-ids.dto';
import { OfferImageDto } from './dto/offer-image.dto';
import { User } from './../auth/models/user.entity';
import { UpdateOfferDto } from './dto/update-offer-dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { GetOffersFilterDto } from './dto/get-offers-filter.dto';
import { CreateOfferDto } from './dto/create-offer-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './../auth/roles.enum';
import { OffersService } from './offers.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { RolesMeta } from 'src/auth/roles.decorator';
import { UserDecorator } from 'src/auth/user.decorator';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('offers')
export class OffersController {
	constructor(private offersService: OffersService) { }
    // // get all category 
    @Get()
    async findAll(@Query() filterDto:GetOffersFilterDto): Promise<any> {
        return this.offersService.findAll(filterDto);
    }
		@Get('/user/get-offers')
		@RolesMeta(Roles.ADMIN,Roles.SUPERVISOR, Roles.USER)
		@UseGuards(AuthGuard('jwt'), RolesGuard)
		async getUserOffers(@UserDecorator() user: User): Promise<any> {
			return this.offersService.getUserOffers(user);
		}
    @Get('/:id')
    async findOne(@Param('id') id: number): Promise<any> {
        return this.offersService.findOne(id);
    }

    @Post()
		@RolesMeta(Roles.ADMIN,Roles.USER)
		@UseGuards(AuthGuard('jwt'))
		@FormDataRequest()
    async create(@Body(ValidationPipe) createOfferDto: CreateOfferDto): Promise<any> {
			console.log({createOfferDto})
        return this.offersService.create(createOfferDto);
    }

		@Put('/:id')
		@RolesMeta(Roles.ADMIN,Roles.USER)
		@UseGuards(AuthGuard('jwt'),RolesGuard)
		@FormDataRequest()
    async update(@Body(ValidationPipe) updateOfferDto:UpdateOfferDto, @Param('id') id: number , ): Promise<any> {
        return this.offersService.update(updateOfferDto, id);
    }
		@Patch('increase-views/:id')
		@RolesMeta(Roles.ADMIN,Roles.USER)
		@UseGuards(RolesGuard)
		@UseGuards(AuthGuard('jwt'),RolesGuard)
		async increaseOfferViews(@Param('id') id: number): Promise<any> {
			return this.offersService.increaseOfferViews(id);
		}
		@Delete('/:id')
		@RolesMeta(Roles.ADMIN,Roles.USER)
		@UseGuards(AuthGuard('jwt'),RolesGuard)
    async delete(@Param('id') id: number, @UserDecorator() user: User): Promise<any> {
        return this.offersService.deleteCat(id, user)
    }

		@Put('/:id/add-favorite')
		@RolesMeta(Roles.ADMIN,Roles.USER,Roles.SUPERVISOR)
		@UseGuards(RolesGuard)
		@UseGuards(AuthGuard('jwt'),RolesGuard)
		async addFavoriteOffer(@Param('id') id: number, @UserDecorator() user: User): Promise<any> {
				return this.offersService.addFavoriteOffer(id,user);
		}
		@Put('/:id/remove-favorite')
		@RolesMeta(Roles.ADMIN,Roles.USER,Roles.SUPERVISOR)
		@UseGuards(RolesGuard)
		@UseGuards(AuthGuard('jwt'),RolesGuard)
		async removeFavoriteOffer(@Param('id') id: number, @UserDecorator() user: User): Promise<any> {
				return this.offersService.removeFavoriteOffer(id,user);
		}

		@Put('/:offerId/add-images')
		@RolesMeta(Roles.ADMIN,Roles.USER,Roles.SUPERVISOR)
		@UseGuards(RolesGuard)
		@UseGuards(AuthGuard('jwt'),RolesGuard)
		@FormDataRequest()
		async addOfferImages(@Param('offerId') offerId: number,@Body(ValidationPipe) offerImageDto:OfferImageDto): Promise<any> {
				return this.offersService.addOfferImages(offerId,offerImageDto);
		}
		@Get('/:id/get-images')
		@RolesMeta(Roles.ADMIN,Roles.USER,Roles.SUPERVISOR)
		@UseGuards(RolesGuard)
		@UseGuards(AuthGuard('jwt'),RolesGuard)
		async getOfferImages(@Param('id') id: number,): Promise<any> {
				return this.offersService.getOfferImages(id);
		}
		@Delete('/:id/remove-images')
		@RolesMeta(Roles.ADMIN,Roles.USER,Roles.SUPERVISOR)
		@UseGuards(RolesGuard)
		@UseGuards(AuthGuard('jwt'),RolesGuard)
		async removeOfferImages(@Param('id') id: number,@Body(ValidationPipe)offerIdsDto:OfferIdsDto): Promise<any> {
				return this.offersService.removeOfferImages(id,offerIdsDto);
		}
}
