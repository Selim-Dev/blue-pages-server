import { OffersService } from './../offers/offers.service';
import { UpdateOfferVideoDto } from './dto/update_video.dto';
import { OfferVideoDto } from './dto/video.dto';
import { FilterOfferVideoDto } from './dto/filter.dto';
import { OfferVideos } from './offer-video.entity';
import { Inject, Injectable, forwardRef, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OfferVideosService {
	constructor(@InjectRepository(OfferVideos) private readonly videoRepository: Repository<OfferVideos>,
		@Inject(forwardRef(() => OffersService)) private readonly offersService: OffersService
	) { }


	async findAll(filtervideoDto: FilterOfferVideoDto) {
		const { offerId } = filtervideoDto
		const query = this.videoRepository.createQueryBuilder('offer_videos')
		const getCompany = await this.offersService.findOne(offerId)
		if (offerId) {
			query.andWhere('offer_videos.offerId=:offerId', { offerId })
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

	async create(videoDto: OfferVideoDto): Promise<any> {
		try {
			const { video, offerId } = videoDto
			const getCompany = await this.offersService.findOne(offerId)

			const video_number = new OfferVideos()
			video_number.video = video
			video_number.offerId = offerId

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
	async createOfferVideos(videos: string[], offerId): Promise<any> {
		try {
			await Promise.all(videos.map(video => {
				const video_object = new OfferVideos()
				video_object.video = video
				video_object.offerId = offerId
				this.videoRepository.create(video_object)
				return this.videoRepository.save(video_object);
			})
			);

		} catch (err) {
			if (err.code === '23505') {
				throw new ConflictException('Name or Email Already Exists');
			} else {
				throw new InternalServerErrorException('HTTP 500 Internal Server Error From Offer Video !!');
			}
		}
	}

	async update(video: UpdateOfferVideoDto, id: number,) {

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
