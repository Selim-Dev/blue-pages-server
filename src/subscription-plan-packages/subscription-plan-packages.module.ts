import { SubscriptionPlanPackage } from 'src/subscription-plan-packages/subscription-plan-package.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SubscriptionPlanPackagesController } from './subscription-plan-packages.controller';
import { SubscriptionPlanPackagesService } from './subscription-plan-packages.service';

@Module({
	imports:[
    TypeOrmModule.forFeature([SubscriptionPlanPackage]),

	],
  controllers: [SubscriptionPlanPackagesController],
  providers: [SubscriptionPlanPackagesService]
})
export class SubscriptionPlanPackagesModule {}
