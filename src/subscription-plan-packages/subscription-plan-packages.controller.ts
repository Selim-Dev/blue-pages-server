import { FilterPlanDto } from './dto/filter-plan';
import { UpdateSubscriptionPlanPackageDto } from './dto/update-subscription-plan-package.dto';
import { CreateSubscriptionPlanPackageDto } from './dto/create-subscription-plan-package.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { SubscriptionPlanPackagesService } from './subscription-plan-packages.service';
import { RolesMeta } from 'src/auth/roles.decorator';

@Controller('subscriptionPlanPackages')
export class SubscriptionPlanPackagesController {
	constructor(private subscriptionPlanPackagesService: SubscriptionPlanPackagesService) { }
	// get all city 
		@Get()
		async findAll(@Query() filter:FilterPlanDto): Promise < any > {
			return this.subscriptionPlanPackagesService.findAll(filter);
		}
		@Get('/:id')
		async findOne(@Param('id') id: number): Promise < any > {
			return this.subscriptionPlanPackagesService.findOne(id);
	
		}
	
		@Post()
		@RolesMeta(Roles.ADMIN)
		@UseGuards(AuthGuard('jwt'), RolesGuard)
		async create(@Body(ValidationPipe) createSubscriptionPlanPackageDto: CreateSubscriptionPlanPackageDto): Promise < any > {
			return this.subscriptionPlanPackagesService.create(createSubscriptionPlanPackageDto);
		}
	
		@Put('/:id')
		@RolesMeta(Roles.ADMIN)
		@UseGuards(AuthGuard('jwt'), RolesGuard)
		async update(@Body(ValidationPipe) updateSubscriptionPlanPackageDto: UpdateSubscriptionPlanPackageDto, @Param('id') id: number,): Promise < any > {
			// console.log(file, "kkkkkk", city, id);
			return this.subscriptionPlanPackagesService.update(updateSubscriptionPlanPackageDto, id);
		}
	
		@Delete('/:id')
		@RolesMeta(Roles.ADMIN)
		@UseGuards(AuthGuard('jwt'), RolesGuard)
		async delete (@Param('id') id: number): Promise < any > {
			return this.subscriptionPlanPackagesService.delete(id)
		}

}	
