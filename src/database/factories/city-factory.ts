import { City } from './../../cities/city.entity';
import { randEmail, randFullName, randPassword } from '@ngneat/falso';
import { define } from 'typeorm-seeding';
import { Connection, getManager,getRepository } from 'typeorm';


define(City, () => {
  const city = new City();
  city.name_en = randFullName();
  city.name_ar = randFullName();
  return city;
});
