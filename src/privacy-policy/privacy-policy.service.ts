import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/s3-service/s3-service.service';
import { Repository } from 'typeorm';
import { PrivacyPolicyDto } from './dto/privacy-policy.dto';
import { UpdatePrivacyPolicyDto } from './dto/update-privacy-policy.dto';
import { PrivacyPolicy } from './privacy-policy.entity';

@Injectable()
export class PrivacyPolicyService {
    constructor(@InjectRepository(PrivacyPolicy) private readonly PrivacyPolicyRepository: Repository<PrivacyPolicy>,
        private readonly s3Service: S3Service,
    ) { }


    async get(): Promise<any> {
        const getPrivacyPolicy = await this.PrivacyPolicyRepository.find()
        if (getPrivacyPolicy.length === 0) throw new NotFoundException('Not found privacy policy')

        return getPrivacyPolicy
    }

    async create(privacyPolicyDto: PrivacyPolicyDto): Promise<any> {

        const getPrivacyPolicy = await this.PrivacyPolicyRepository.find()
        if (getPrivacyPolicy.length !== 0) { throw new NotFoundException('the PrivacyPolicy Already Exist you can update data') }

        const createdPrivacyPolicy = await this.PrivacyPolicyRepository.create(privacyPolicyDto)
        try {
            await this.PrivacyPolicyRepository.save(createdPrivacyPolicy);
            return createdPrivacyPolicy
        } catch (err) {
            if (err.code === '23505') {
                throw new ConflictException('the PrivacyPolicy Already Exist you can update data');
            } else {
                throw new InternalServerErrorException('HTTP 500 Internal Server Error !!');
            }
        }

    }




    async update(updatePrivacyPolicyDto: UpdatePrivacyPolicyDto, id: number) {
        try {
            const PrivacyPolicy = await this.PrivacyPolicyRepository.findOne(id)
            if (!PrivacyPolicy) throw new NotFoundException('Not found privacy policy')


            const result = await this.PrivacyPolicyRepository.update({ id }, { ...updatePrivacyPolicyDto });
            if (result.affected === 0) { // affected === 0 means that no rows were found
                throw new NotFoundException('PrivacyPolicy can not updated');
            } else {
                const getPrivacyPolicy = await this.PrivacyPolicyRepository.findOne(id);
                return getPrivacyPolicy;
            }
        } catch (e) {
            throw new NotFoundException("The PrivacyPolicy can not update : " + e)
        }
    }



}
