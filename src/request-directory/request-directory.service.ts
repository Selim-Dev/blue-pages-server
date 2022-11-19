import { ConflictException, forwardRef, Inject, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/models/user.entity';
import { UpdateRequestDirectoryDto } from './dto/update-request-directory.dto';
import { Repository, getRepository } from 'typeorm';
import { RequestDirectoryDto } from './dto/request-directory.dto';
import { RequestDirectory } from './request-directory.entity';
// import { Getrequest_directoryFilterDto } from './dto/countryFilter.dto';
import { S3Service } from 'src/s3-service/s3-service.service';
import { FilterRequestDirectoryDto } from './dto/filter-request-directory.dto';
import { Category } from '../categories/category.entity';
import { CitiesService } from 'src/cities/cities.service';
import { DirectoryService } from 'src/directories/directory.service';
import { AuthService } from 'src/auth/auth.service';


@Injectable()
export class RequestDirectoryService {
	constructor(@InjectRepository(RequestDirectory)
	private readonly requestDirectoryRepository: Repository<RequestDirectory>,
		@Inject(forwardRef(() => CitiesService)) private readonly citiesService: CitiesService,
		@Inject(forwardRef(() => DirectoryService)) private readonly directoryService: DirectoryService,
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
	) { }


	async findAll(filterDto: FilterRequestDirectoryDto) {
		try {
			const { status, type, userId } = filterDto;
			const query = this.requestDirectoryRepository.createQueryBuilder('request-directory')
			if (status) {
				query.andWhere('request-directory.status=:status', { status });
			}
			if (type) {
				query.andWhere('request-directory.type=:type', { type });
			}
			if (userId) {
				query.andWhere('request-directory.userId=:userId', { userId });
			}
			query.leftJoinAndSelect('request-directory.directory','directory')
			query.leftJoinAndSelect('request-directory.city','city')
			return await query.getMany();
		} catch (e) {
			throw new NotFoundException('Thare Is No Request Directory');
		}
	}
	async getUserRequestDirectories(user: User) {
		const query = this.requestDirectoryRepository.createQueryBuilder('request-directory')
			.orderBy('request-directory.updatedAt', 'DESC')
			.leftJoinAndSelect("request-directory.directory", "directory")
			.leftJoinAndSelect("request-directory.city", "city")
			.where("request-directory.userId= :userId", { userId: Number(user.id) })
		try {
			const directory = await query.getMany();
			if (!directory) {
				throw new NotFoundException('directory is not found');
			}
			return directory
		} catch (e) {
			throw new NotFoundException('directory is not found');
		}
	}
	async findOne(id: number) {
		try {
			return await this.requestDirectoryRepository.findOne(id,{relations:['directory','city']});
		} catch (e) {
			throw new NotFoundException('Request Directory is not found');
		}
	}

	async create(requestDirectory): Promise<any> {
		console.log({ requestDirectory });
		const { cityId, userId } = requestDirectory;

		const getCity = await this.citiesService.findOne(cityId)
		if (!getCity) {
			throw new NotFoundException("City Not found ")
		}
		// const getUser = await this.authService.findUserById(userId)
		const getUser = await getRepository(User).findOne(userId);

		if (!getUser) {
			throw new NotFoundException("User Not found ")
		}

		const createRqDi = this.requestDirectoryRepository.create({ ...requestDirectory })
		try {

			return await this.requestDirectoryRepository.save({ ...createRqDi });
		} catch (err) {
			console.log(err)
			if (err.code === '23505') {
				throw new ConflictException('this country Already Exists');
			} else {
				throw new InternalServerErrorException('HTTP 500 Internal Server Error !!');
			}
		}

	}


	async update(updateRequestDirectoryDto, id: number) {
		const getReq = await this.requestDirectoryRepository.findOne(id)
		if (!getReq) {
			throw new NotFoundException("request Not found ")
		}

		if (updateRequestDirectoryDto.status === 'accepted') {
			// @ts-ignore: Unreachable code error
			const { cityId } = getReq
			// @ts-ignore: Unreachable code error
			const getDirectory = await this.directoryService.findAll(cityId)
			if (!getDirectory.length) {
				throw new NotFoundException("Directory Not found please add directory to city")
			}
			// const { pdf } = getDirectory[0]

			const result = await this.requestDirectoryRepository.update({ id }, { ...updateRequestDirectoryDto, directoryId:getDirectory[0].id });
			if (result.affected === 0) { // affected === 0 means that no rows were found
				throw new NotFoundException('RequestDirectory can not updated');
			} else {
				const gitCat = await this.requestDirectoryRepository.findOne(id);
				return gitCat;
			}
		}

		const result = await this.requestDirectoryRepository.update({ id }, { ...updateRequestDirectoryDto});
		if (result.affected === 0) { // affected === 0 means that no rows were found
			throw new NotFoundException('RequestDirectory can not updated');
		} else {
			const gitCat = await this.requestDirectoryRepository.findOne(id);
			return gitCat;
		}


	}

	async delete(id: number) {
		const result = await this.requestDirectoryRepository.delete(id)
		if (result.affected === 0) { // affected === 0 means that no rows were found
			throw new NotFoundException('RequestDirectory can not deleted');
		} else {
			return true;
		}
	}



}
