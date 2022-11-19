import { ConflictException, Inject, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoDto } from './dto/video.dto';
import { UpdateVideoDto } from './dto/update_video.dto';
import { Video } from './video.entity';
import { FilterVideoDto } from './dto/filter.dto';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class VideoService {
	constructor(@InjectRepository(Video) private readonly videoRepository: Repository<Video>,
		@Inject(forwardRef(() => CompaniesService)) private readonly CompaniesService: CompaniesService
	) { }


	async findAll(filtervideoDto: FilterVideoDto) {
		const { companyId } = filtervideoDto
		const query = this.videoRepository.createQueryBuilder('video')
		const getCompany = await this.CompaniesService.findOne(companyId)
		if (companyId) {
			query.andWhere('video.companyId=:companyId', { companyId })
		}
		try {
			return query.getMany();
		} catch (e) {
			throw new NotFoundException('thare is no branches with error : ' + e);
		}
	}

	async findOne(id: number) {
		try {
			return await this.videoRepository.findOne(id);
		} catch (e) {
			throw new NotFoundException('video is not found');
		}
	}

	async create(videoDto: VideoDto,): Promise<VideoDto> {
		try {
			const { video, companyId } = videoDto
			const getCompany = await this.CompaniesService.findOne(companyId)

			const video_number = new Video()
			video_number.video = video
			video_number.companyId = companyId

			this.videoRepository.create(video_number)
			return await this.videoRepository.save(video_number);
		} catch (err) {
			if (err.code === '23505') {
				throw new ConflictException('Name or Email Already Exists');
			} else {
				throw new InternalServerErrorException('HTTP 500 Internal Server Error !!');
			}
		}
	}
	async createCompanyVideos(videos: string[], companyId): Promise<any> {
		try {
			await Promise.all(videos.map(video => {
				const video_object = new Video()
				video_object.video = video
				video_object.companyId = companyId
				const videoCreated = this.videoRepository.create(video_object)
				return this.videoRepository.save(videoCreated);
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

	async update(video: UpdateVideoDto, id: number,) {

		const result = await this.videoRepository.update({ id }, { ...video });
		if (result.affected === 0) { // affected === 0 means that no rows were found
			throw new NotFoundException('video can not deleted');
		} else {
			const gitCat = await this.videoRepository.findOne(id);
			return gitCat;
		}
	}

	async delete(id: number,) {

		const result = await this.videoRepository.delete(id)
		if (result.affected === 0) { // affected === 0 means that no rows were found
			throw new NotFoundException('video can not deleted');
		} else {
			return true;
		}
	}

}
