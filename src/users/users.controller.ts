import { UpdateUserPasswordDto } from './dto/update-password.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { User } from './../auth/models/user.entity';
import {  updateUserDto } from './dto/update-user.dto';
import { createUserDto } from './dto/create-user.dto';
import { RolesGuard } from './../auth/guards/roles.guard';
import { Roles } from './../auth/roles.enum';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { RolesMeta } from '../auth/roles.decorator';
import { UserDecorator } from '../auth/user.decorator';
import { ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('User')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
	
	constructor(private usersService: UsersService) { }

	// get all users 
	@Get()
	@RolesMeta(Roles.ADMIN)
	@UseGuards(RolesGuard)
	async findAll(@Query() filterDto: GetUsersFilterDto,@UserDecorator() user: User): Promise<any> {
			return this.usersService.findAll(filterDto);
	}
	@Get('/getUserProfile/me')
	@RolesMeta(Roles.ADMIN,Roles.USER,Roles.SUPERVISOR)
	@UseGuards(RolesGuard)
	async findUserData(@UserDecorator() user: User): Promise<any> {
			return this.usersService.getMyProfile(user);
	}

	@Get('/:id')
	@RolesMeta(Roles.ADMIN)
	@UseGuards(RolesGuard)
	async findOne(@Param('id') id: number): Promise<any> {
			return this.usersService.findOne( id);
	}

	@ApiCreatedResponse({
		description: 'created user object as response',
		type:User
	})
	@ApiConflictResponse({
		description:'user credentials exist in database already'
	})
	@ApiInternalServerErrorResponse({
		description:'When Something Wrong Happens in Code, Malfunction'
	})
	@ApiNotFoundResponse({
		description:'When there is problem with authentication'
	})
	@Post()
	@RolesMeta(Roles.ADMIN)
	@UseGuards(RolesGuard)
	async create(@Body(ValidationPipe) createUserDto: createUserDto): Promise<any> {
			return this.usersService.create(createUserDto);
	}
	@Put('/password/update')
	@RolesMeta(Roles.ADMIN,Roles.SUPERVISOR,Roles.USER)
	@UseGuards(RolesGuard)
	async updatePassword(@Body(ValidationPipe) updateUserPasswordDto: UpdateUserPasswordDto,@UserDecorator() user: User): Promise<any> {
			return this.usersService.updatePassword(updateUserPasswordDto, user);
	}
	@Put('/:id')
	@RolesMeta(Roles.ADMIN,Roles.USER)
	@UseGuards(RolesGuard)
	async update(@Body(ValidationPipe) updateUserDto: updateUserDto, @Param('id') id: number): Promise<any> {
			return this.usersService.update(updateUserDto, id);
	}

	@Delete('/:id')
	@RolesMeta(Roles.ADMIN)
	@UseGuards(RolesGuard)
	async delete(@Param('id') id: number): Promise<any> {
			return this.usersService.delete(id)
	}



}
