import { SubscriptionPlan } from './../../subscription-plans/subscription-plan.entity';

import { Connection, getConnection, getManager,getRepository } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';


export class SubscriptionPlanSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
		const subscription_plans = await getRepository(SubscriptionPlan).find();
		if(subscription_plans.length) return;
		const plans = [
			{
				package_id:1,
				name_en:'FREE',
				name_ar:'مجاني وموثق',
			},
			{
				package_id:2,
				name_en:'BASIC',
				name_ar:'مدفوع اساسي',
			},
			{
				package_id:3,
				name_en:'PREMIUM',
				name_ar:'بريميم إعلان مميز ',
			},
			{
				package_id:4,
				name_en:'SILVER',
				name_ar:'لفضي',
			},
			{
				package_id:5,
				name_en:'GOLD',
				name_ar:'لذهبي',
			}
		] 

		await Promise.all(plans.map(({package_id,name_en,name_ar})=>{
			return  getRepository(SubscriptionPlan).save({package_id,name_en,name_ar})
		}));
  }
}
