import { SubscriptionPlan } from './../../subscription-plans/subscription-plan.entity';
import { City } from './../../cities/city.entity';
import { randEmail, randFullName, randNumber, randPassword } from '@ngneat/falso';
import { define } from 'typeorm-seeding';
import { Connection, getManager,getRepository } from 'typeorm';


define(SubscriptionPlan, () => {
  const subscriptionPlan = new SubscriptionPlan();
  subscriptionPlan.package_id = randNumber();
  subscriptionPlan.name_en = randFullName();
  subscriptionPlan.name_ar = randFullName();
  return subscriptionPlan;
});
