import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { BranchesController } from './branches.controller';
import { Branch } from './branches.entity';
import { BranchesService } from './branches.service';
import { BranchesDto } from './dto/branches.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch]),
    forwardRef(() => CompaniesModule),
      AuthModule
  ],
  exports: [ BranchesService],
  controllers: [BranchesController],
  providers: [BranchesService]
})
export class BranchesModule { }
