import { UpdateCompanyDto } from './../dto/update-company.dto';
import { Company } from './../company.entity';
import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { InjectRepository } from '@nestjs/typeorm';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
	constructor(@InjectRepository(Company) private readonly companyRepository: Repository<Company>,
	) { }
  async validate(company: UpdateCompanyDto) {
		const query = this.companyRepository.createQueryBuilder('task');

    // try {
    // const company =  await this.companyRepository.findOne(name_ar);

    // } catch (e) {
    //   return false;
    // }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `User doesn't exist`;
  }
}