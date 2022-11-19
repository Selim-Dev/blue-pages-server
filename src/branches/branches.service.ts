import { ConflictException, forwardRef, Inject, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/models/user.entity';
import { UpdateBranchesDto } from './dto/updateBranches.dto';
import { Repository, getRepository } from 'typeorm';
import { BranchesDto } from './dto/branches.dto';
import { Branch } from './branches.entity';
import { FilterBranchesDto } from './dto/filter.dto';
import { AuthService } from 'src/auth/auth.service';
import { CompaniesService } from 'src/companies/companies.service';


@Injectable()
export class BranchesService {
    constructor(@InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>,
        private readonly usersService: AuthService,
        @Inject(forwardRef(() => CompaniesService)) private readonly companyService: CompaniesService,

    ) { }


    async findAll(filterBranchesDto: FilterBranchesDto) {
        const { userId, companyId } = filterBranchesDto
        const query = this.branchesRepository.createQueryBuilder('branch')
        if (userId) {
            query.andWhere('branch.userId=:userId', { userId })
        }
        if (companyId) {
            query.andWhere('branch.companyId=:companyId', { companyId })
        }
        try {
            return query.getMany();
        } catch (e) {
            throw new NotFoundException('thare is no branches with error : ' + e);
        }
    }

    async findOne(id: number) {
        try {
            return await this.branchesRepository.findOne(id);
        } catch (e) {
            throw new NotFoundException('branche not found');
        }
    }

    async create(branchesDto: BranchesDto): Promise<any> {
        // const user = this.usersService.findUserById(branchesDto.userId)
				const user = await getRepository(User).findOne(branchesDto.userId);
        if (!user) {
            throw new NotFoundException("can not create branch because Not found company by company id")
        }
        const company = this.companyService.findOne(branchesDto.companyId)
        if (!company) {
            throw new NotFoundException("can not create branch because Not found company by company id")
        }

        const branches = new Branch()
        const { name_ar, name_en, address_ar, address_en, phone, description_ar, description_en,
            link, userId, companyId } = branchesDto

        branches.name_ar = name_ar
        branches.name_en = name_en
        branches.address_ar = address_ar
        branches.address_en = address_en
        branches.phone = phone
        branches.description_ar = description_ar
        branches.description_en = description_en
        branches.link = link
        branches.userId = userId
        branches.companyId = companyId


        try {
            this.branchesRepository.create(branches)
            return await this.branchesRepository.save(branches);
        } catch (e) {
            throw new InternalServerErrorException('there is error in server' + e);

        }

    }

    async createCompanyBranches(branches, companyId,userId): Promise<any> {
        try {
            await Promise.all(branches.map(branch => {
                const { name_ar, name_en, address_ar, address_en, phone, description_ar, description_en,
                    link } = branch
									const user = this.usersService.findUserById(userId)
									if (!user) {
											throw new NotFoundException("can not create branch because Not found company by company id")
									}
									const company = this.companyService.findOne(companyId)
									if (!company) {
											throw new NotFoundException("can not create branch because Not found user by user id")
									}
                const single_branch = new Branch()
                single_branch.name_ar = name_ar
                single_branch.name_en = name_en
                single_branch.address_ar = address_ar
                single_branch.address_en = address_en
                single_branch.phone = phone
                single_branch.description_ar = description_ar
                single_branch.description_en = description_en
                single_branch.link = link
                single_branch.userId = userId
                single_branch.companyId = companyId

                const createBranch = this.branchesRepository.create(single_branch)
                return this.branchesRepository.save(createBranch);
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


    async update(branches: UpdateBranchesDto, id: number) {

        const result = await this.branchesRepository.update({ id }, { ...branches });
        if (result.affected === 0) { // affected === 0 means that no rows were found
            throw new NotFoundException('branch can not update');
        } else {
            const gitCat = await this.branchesRepository.findOne(id);
            return gitCat;
        }
    }

    async delete(id: number) {
        const result = await this.branchesRepository.delete(id)
        if (result.affected === 0) { // affected === 0 means that no rows were found
            throw new NotFoundException('categories can not deleted');
        } else {
            return true;
        }
    }

}
