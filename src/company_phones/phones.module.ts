import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from 'src/companies/companies.module';
import { Phone } from './phone.entity';
import { PhonesController } from './phones.controller';
import { PhonesService } from './phones.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Phone]),
    forwardRef(()=>CompaniesModule)
  ],
  controllers: [PhonesController],
  providers: [PhonesService],
	exports: [PhonesService],

})
export class PhonesModule {}
