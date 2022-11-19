import { Offer } from './offer.entity';
import { OffersService } from './offers.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Connection, getManager, getRepository } from 'typeorm';
import * as moment from 'moment';


@Injectable()
export class OffersCronService {

	constructor(private offersService: OffersService) {

	}
	private readonly logger = new Logger(OffersCronService.name);

	@Cron(CronExpression.EVERY_DAY_AT_1AM)
	async handleCron() {
		const service = await getRepository(Offer).createQueryBuilder()
		.update(Offer)
		.set({ status: false  })
		.where('status = :status', { status: true})
		.andWhere('endAt < :currentTime', { currentTime:  moment().toISOString()})
		.execute();
		// 	await getConnection()
		// .createQueryBuilder()
		// .update(User)
		// .set({ name: `:new_name` })
		// .where('name = :name', { name: 'darragh', new_name: 'new name' })
		// .execute()
	}
}