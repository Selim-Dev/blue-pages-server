import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { PrivacyPolicyController } from './privacy-policy.controller';
import { PrivacyPolicyService } from './privacy-policy.service';
import { PrivacyPolicy } from './privacy-policy.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrivacyPolicy]),
    forwardRef(() => AppModule)
  ],
  controllers: [PrivacyPolicyController],
  providers: [PrivacyPolicyService]
})
export class PrivacyPolicyModule { }
