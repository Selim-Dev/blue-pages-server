import * as moment from 'moment';
import { forwardRef, Inject, Injectable, } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordEntity } from '../models/password.entity';
import { Repository } from 'typeorm';
import { async } from 'rxjs';


@Injectable()
export class JobService {
    constructor(@InjectRepository(PasswordEntity) private readonly passwordRepository: Repository<PasswordEntity>,
    ) { }

    // Cron Job to delete token after 24 hours from the database
    // @Cron('* * * * * *')
    async handleCron() {
        const query = await this.passwordRepository.createQueryBuilder('reset_password');
        query.where(`reset_password.createdAt  < '${moment().subtract(1, 'days').toISOString()}'`)

        const getToken = await query.getMany();
        console.log(getToken);

        if (getToken) {
            getToken.forEach(async token => {
                await this.passwordRepository.delete(token.id)
            })
        }
    }
}