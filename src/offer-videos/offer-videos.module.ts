import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { OfferVideosController } from './offer-videos.controller';
import { OfferVideosService } from './offer-videos.service';
import { OfferVideos } from './offer-video.entity';
import { OffersModule } from 'src/offers/offers.module';

@Module({
	imports:[
		TypeOrmModule.forFeature([OfferVideos]),
    forwardRef(()=>OffersModule)
	],
  controllers: [OfferVideosController],
  providers: [OfferVideosService],
	exports:[OfferVideosService]
})
export class OfferVideosModule {}
