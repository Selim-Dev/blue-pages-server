import { Setting } from './../../settings/setting.entity';

import { Connection, getConnection, getManager,getRepository } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';


export class SettingsCreateSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
		const settings = await getRepository(Setting).find({id:1});
		console.log(settings)
		if(settings.length) return;
		try{
			await factory(Setting)().create({
				title_en: 'Blue Pages',
				title_ar: 'الصفحات الزرقاء',
				description_en: 'Biggest Directory For Companies',
				description_ar: 'أكبر مكان لزياده أعمالك',
				keywords: 'directory, business',
				facebook: 'http://facebook.com',
				twitter: 'http://twitter.com',
				instagram: 'http://instagram.com',
				linkedin: 'http://linkedin.com',
				snapchat: 'http://snapchat.com',
				youtube: 'http://youtube.com',
				phone: '9600000000',
				email: 'bluepages@gmail.com',
				whatsapp: '9600000000',
				address_en: 'Mekka',
				address_ar: 'مكه',
				latitude: '24.706218',
				longitude: '46.672805',
				copyright_en: '© directory 2022, All Rights Reserved',
				copyright_ar: '©directory 2022, جميع الحقوق محفوظة	',
				location: 'Mekka',
				logo_ar: 'https://about.gitlab.com/images/press/logo/preview/gitlab-logo-200-preview.png',
				logo_en: 'https://about.gitlab.com/images/press/logo/preview/gitlab-logo-200-preview.png',
			});
		}catch(err){
			console.log({err})
		}
  }
}
