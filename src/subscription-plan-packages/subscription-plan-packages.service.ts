import { FilterPlanDto } from './dto/filter-plan';
import { UpdateSubscriptionPlanPackageDto } from './dto/update-subscription-plan-package.dto';
import { CreateSubscriptionPlanPackageDto } from './dto/create-subscription-plan-package.dto';
import { SubscriptionPlan } from './../subscription-plans/subscription-plan.entity';
import { Repository, getRepository } from 'typeorm';
import { SubscriptionPlanPackage } from 'src/subscription-plan-packages/subscription-plan-package.entity';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubscriptionPlanPackagesService {
	constructor(@InjectRepository(SubscriptionPlanPackage) private readonly subscriptionPlanPackageRepository: Repository<SubscriptionPlanPackage>,
	) { }

	async findAll(filter:FilterPlanDto) {
		const {planId} = filter;
		const query = await this.subscriptionPlanPackageRepository.createQueryBuilder('subscription_plan_packages')

		if (planId) {
				query.andWhere('subscription_plan_packages.subscriptionPlanId=:subscriptionPlanId', { subscriptionPlanId:planId });
		}
		query.leftJoin('subscription_plan_packages.subscriptionPlan', 'subscriptionPlan')
		query.addSelect(['subscriptionPlan.id','subscriptionPlan.name_en', 'subscriptionPlan.name_ar', 'subscriptionPlan.status'])
		try {
			const packages = query.getMany()
			return  packages;
		} catch (e) {
			console.log({e})
			throw new InternalServerErrorException('something wrong happened');
		}
	}

	async findOne(id: number) {
		const planPackage =  await this.subscriptionPlanPackageRepository.createQueryBuilder('subscription_plan_packages')
		.where('subscription_plan_packages.id = :id',{id})
		.leftJoin('subscription_plan_packages.subscriptionPlan', 'subscriptionPlan')
		.addSelect(['subscriptionPlan.id','subscriptionPlan.name_en', 'subscriptionPlan.name_ar', 'subscriptionPlan.status'])
		.getOne();
		if(!planPackage) throw new NotFoundException('Subscription Plan Package Not Found')
		return planPackage;

	}
	// ////////////////////////////////////////////////
	async create(createSubscriptionPlanPackageDto: CreateSubscriptionPlanPackageDto): Promise<any> {
		const { title_ar, title_en, duration, price, subscriptionPlanId } = createSubscriptionPlanPackageDto;

		const subscription_plan = await getRepository(SubscriptionPlan).findOne({package_id:subscriptionPlanId});

		if (!subscription_plan) throw new NotFoundException('subscription plan not found')

		const createdSubscriptionPlanPackage = this.subscriptionPlanPackageRepository.create({ title_ar, title_en, duration, price, subscriptionPlanId })
		try {
			const savedPlanPackage = await this.subscriptionPlanPackageRepository.save(createdSubscriptionPlanPackage);
			return savedPlanPackage
		} catch (err) {
			throw new InternalServerErrorException('Something Wrong Happened!');
		}

	}


	async update(updateSubscriptionPlanPackageDto: UpdateSubscriptionPlanPackageDto, id: number) {
		try {
			const getPlanPackage = await this.findOne(id)
			if (!getPlanPackage) throw new NotFoundException('Subscription Plan Package not found');


			const result = await this.subscriptionPlanPackageRepository.update({ id }, { ...updateSubscriptionPlanPackageDto });

			if (result.affected === 0) { // affected === 0 means that no rows were found
				throw new InternalServerErrorException('subscription Plan Package edited unSuccessfully');
			} else {
				const planPackage = await this.subscriptionPlanPackageRepository.findOne(id);
				return planPackage;
			}
		} catch (e) {
			throw new InternalServerErrorException("Something Wrong Happened")
		}
	}

	async delete(id: number) {
		const getPlanPackage = await this.findOne(id)
		if (!getPlanPackage) throw new NotFoundException('Subscription Plan Package not found');

		const result = await this.subscriptionPlanPackageRepository.delete(id)
		if (result.affected === 0) { // affected === 0 means that no rows were found
			throw new NotFoundException('Subscription Plan Package not deleted');
		} else {
			return true;
		}
	}

}
