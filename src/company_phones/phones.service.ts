import { ConflictException, Inject, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/models/user.entity';
import { Repository } from 'typeorm';
import { PhoneDto } from './dto/phone.dto';
import { UpdatePhoneDto } from './dto/updatePhone.dto';
import { Phone } from './phone.entity';
import { FilterPhoneDto } from './dto/filter.dto';
import { CompaniesService } from 'src/companies/companies.service';

@Injectable()
export class PhonesService {
	constructor(@InjectRepository(Phone) private readonly phoneRepository: Repository<Phone>,
		@Inject(forwardRef(() => CompaniesService)) private readonly CompaniesService: CompaniesService
	) { }


	async findAll(filterPhoneDto: FilterPhoneDto) {
		const { companyId } = filterPhoneDto
		const query = this.phoneRepository.createQueryBuilder('phone')
		const getCompany = await this.CompaniesService.findOne(companyId)
		if (companyId) {
			query.andWhere('phone.companyId=:companyId', { companyId })
		}
		try {
			return query.getMany();
		} catch (e) {
			throw new NotFoundException('thare is no branches with error : ' + e);
		}
	}

	async findOne(id: number) {
		try {
			return await this.phoneRepository.findOne(id);
		} catch (e) {
			throw new NotFoundException('Phone is not found');
		}
	}

	async create(phoneDto: PhoneDto,): Promise<PhoneDto> {
		try {
			const { phone, companyId } = phoneDto
			const getCompany = await this.CompaniesService.findOne(companyId)

			const phone_number = new Phone()
			phone_number.phone = phone
			phone_number.companyId = companyId

			this.phoneRepository.create(phone_number)
			return await this.phoneRepository.save(phone_number);
		} catch (err) {
			if (err.code === '23505') {
				throw new ConflictException('Name or Email Already Exists');
			} else {
				throw new InternalServerErrorException('HTTP 500 Internal Server Error !!');
			}
		}
	}
	async createCompanyPhones(phones: string[], companyId): Promise<any> {
		try {
			await Promise.all(phones.map(phone => {
				const phone_number = new Phone()
				phone_number.phone = phone
				phone_number.companyId = companyId
				this.phoneRepository.create(phone_number)
				return this.phoneRepository.save(phone_number);
			})
			);

		} catch (err) {
			if (err.code === '23505') {
				throw new ConflictException('Name or Email Already Exists');
			} else {
				throw new InternalServerErrorException('HTTP 500 Internal Server Error !!');
			}
		}
	}


	async update(phone: UpdatePhoneDto, id: number,) {

		const result = await this.phoneRepository.update({ id }, { ...phone });
		if (result.affected === 0) { // affected === 0 means that no rows were found
			throw new NotFoundException('Phone can not deleted');
		} else {
			const gitCat = await this.phoneRepository.findOne(id);
			return gitCat;
		}
	}

	async delete(id: number,) {

		const result = await this.phoneRepository.delete(id)
		if (result.affected === 0) { // affected === 0 means that no rows were found
			throw new NotFoundException('Phone can not deleted');
		} else {
			return true;
		}
	}

}
