import { Company } from './company.entity';
import { CompaniesService } from 'src/companies/companies.service';

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Connection, getManager, getRepository } from 'typeorm';
import * as moment from 'moment';


@Injectable()
export class SubscriptionPlanCronService {

	constructor(private companiesService: CompaniesService) {

	}
	// EVERY_DAY_AT_1AM
	private readonly logger = new Logger(SubscriptionPlanCronService.name);

	@Cron(CronExpression.EVERY_DAY_AT_1AM)
	async handleCron() {
		const company = await getRepository(Company).createQueryBuilder()
		.update(Company)
		.set({subscriptionPlanId:1,plan:{"name_en": "FREE","name_ar": "مجاني وموثق","status": true} ,subscriptionPlanPackageId: null,packageExpiration:null  })
		.where('subscriptionPlanId != :subscriptionPlanId', { subscriptionPlanId: 1})
		.andWhere('packageExpiration < :currentTime', { currentTime:  moment().toISOString()})
		.execute();
		// 	await getConnection()
		// .createQueryBuilder()
		// .update(User)
		// .set({ name: `:new_name` })
		// .where('name = :name', { name: 'darragh', new_name: 'new name' })
		// .execute()
	}
}