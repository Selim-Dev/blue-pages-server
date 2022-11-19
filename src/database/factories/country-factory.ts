import { Country } from './../../countries/country.entity';
import { randEmail, randFullName, randPassword } from '@ngneat/falso';
import { define } from 'typeorm-seeding';
define(Country, () => {
  const country = new Country();
  country.name_en = randFullName();
  country.name_ar = randFullName();
  country.title_en = randFullName();
  country.subtitle_en = randFullName();
  country.title_ar = randFullName();
  country.subtitle_ar = randFullName();
  country.code = randFullName();
	country.flag  = 'https://images.pexels.com/photos/2129796/pexels-photo-2129796.png?auto=compress&cs=tinysrgb&w=600';
  return country;
});
