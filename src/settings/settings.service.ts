import { IncreaseViewsDto } from './dto/increase-views.dto';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/s3-service/s3-service.service';
import { Repository } from 'typeorm';
import { SettingDto } from './dto/setting.dto';
import { UpdateSettingDto } from './dto/updateSettings.dto';
import { Setting } from './setting.entity';

@Injectable()
export class SettingsService {
	constructor(@InjectRepository(Setting) private readonly settingRepository: Repository<Setting>,
		private readonly s3Service: S3Service,
	) { }


	async get(): Promise<any> {
		const getSetting = await this.settingRepository.findOne({id:1})
		if (!getSetting) throw new NotFoundException('Not found setting')
		return getSetting
	}


	async create(settingDto: SettingDto): Promise<any> {
		const getSetting = await this.settingRepository.find()
		if (getSetting.length !== 0) { throw new NotFoundException('the setting Already Exist you can update data') }
		const { file, ...settingsData } = settingDto;
		try {
			const { Location, Key } = await this.s3Service.s3UploadFile(file)

			settingsData.logo = Location
			settingsData.logo_key = Key

			// if (!setting) throw new NotFoundException('cant found setting by setting ID')

			const createdSetting = await this.settingRepository.create(settingsData)

			await this.settingRepository.save(createdSetting);
			return createdSetting
		} catch (err) {
			if (err.code === '23505') {
				throw new ConflictException('the setting Already Exist you can update data');
			} else {
				throw new InternalServerErrorException('HTTP 500 Internal Server Error !!');
			}
		}

	}




	async update(updateSettingDto: UpdateSettingDto) {
		const setting = await this.settingRepository.findOne({id:1})
		const { logoFileAr,logoFileEn, ...settingData } = updateSettingDto;
		// if (file) {
		// 	const { Location, Key } = await this.s3Service.s3Update(setting.logo_key, file)
		// 	updateSettingDto.logo = Location
		// 	updateSettingDto.logo_key = Key
		// }
		if (logoFileAr) {
			if (setting.logo_ar_key) {
				await this.s3Service.s3Update(setting.logo_ar_key, logoFileAr)
			} else {
				const { Location, Key } = await this.s3Service.s3UploadFile(logoFileAr)
				const logo = Location
				const logo_key = Key
				settingData.logo_ar = logo;
				settingData.logo_ar_key = logo_key;
			}
		}
		if (logoFileEn) {
			if (setting.logo_en_key) {
				await this.s3Service.s3Update(setting.logo_en_key, logoFileEn)
			} else {
				const { Location, Key } = await this.s3Service.s3UploadFile(logoFileEn)
				const logo = Location
				const logo_key = Key
				settingData.logo_en = logo;
				settingData.logo_en_key = logo_key;
			}
		}
		try {

			const result = await this.settingRepository.save({ ...setting,...settingData });
			if(!result)	throw new NotFoundException("The Setting can not update : ")
			return result;
		} catch (e) {
			throw new NotFoundException("The Setting can not update : " + e)
		}
	}
	async increaseViews(increaseViewsDto: IncreaseViewsDto) {
		const { companies, offers, total } = increaseViewsDto;
		try {
			const setting = await this.settingRepository.findOne({ id: 1 });
			const updateObject = {};
			if (companies === 'true') updateObject['company_views'] = setting.company_views + 1;
			if (offers === 'true') updateObject['offer_views'] = setting.offer_views + 1;
			if (total === 'true' || companies === 'true' || offers === 'true') updateObject['total_views'] = setting.total_views + 1;

			const result = await this.settingRepository.update({ id: 1 }, updateObject);
			if (result.affected === 0) { // affected === 0 means that no rows were found
				throw new NotFoundException('Setting can not updated');
			} else {
				const gitSetting = await this.settingRepository.findOne({ id: 1 });
				return gitSetting;
			}
		} catch (e) {
			throw new NotFoundException("The Setting can not update : " + e)
		}
	}



}
