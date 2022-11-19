import { City } from './../../cities/city.entity';
import { Country } from './../../countries/country.entity';
import { Category } from './../../categories/category.entity';
import { Connection, getConnection, getManager,getRepository } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';


export class CountryCreateSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
		const countries = await getRepository(Country).find();
		const cities = await getRepository(City).find();
		if(countries.length && cities.length) return;
		// if(!cities.length) {
		// 	const repository = await getConnection().getRepository('country');
		// 	await repository.query(`TRUNCATE countries RESTART IDENTITY CASCADE;`);
		// 	return ;
		// };
		
    // await factory(Country)().createMany(5);

		const country = await factory(Country)().create({
			name_ar: 'السعوديه',
			name_en: 'Saudi Arabia',
			title_en:'Blue Pages Directory',
			subtitle_en:'is the largest commercial encyclopedia of members of the Blue chambers of commerce in the kingdom',
			title_ar:'دليل الصفحات الزرقاء',
			subtitle_ar:'أكبر موسوعة تجارية صناعية لمشتركي الغرف التجاريه',
			code:'SA',
			flag: 'https://cdn.britannica.com/79/5779-004-DC479508/Flag-Saudi-Arabia.jpg',
		});
		await factory(City)().create({
			name_ar: 'مكه',
			name_en: 'Mekka',
			countryId: country.id,
			image: 'https://www.makkahcci.org.sa/web/image/res.company/1/logo',
		});
		await factory(City)().create({
			name_ar: 'جده',
			name_en: 'Gedda',
			countryId: country.id,
			image: 'https://maaal.com/wp-content/uploads/2020/05/%D8%BA%D8%B1%D9%81%D8%A9-%D8%AC%D8%AF%D8%A9.png',
		});
  }
}
