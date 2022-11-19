import { OffersModule } from './../offers/offers.module';
import { CompaniesModule } from './../companies/companies.module';
import { User } from './../auth/models/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports:[
    TypeOrmModule.forFeature([User]),
		// CompaniesModule,
		// OffersModule
	],
  controllers: [UsersController],
  providers: [UsersService],
	exports:[UsersService]
})
export class UsersModule {}
