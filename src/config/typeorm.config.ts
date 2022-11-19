import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
// postgres://cafclowq:CH2rNYUvTJnUnrVVjbXxqTifUd2G1xcf@tyke.db.elephantsql.com/cafclowq
export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: async (): Promise<TypeOrmModuleOptions> => {
		const isProduction = process.env.STAGE ==='prod'
		return {
			ssl:isProduction,
			type: 'postgres',
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			port:process.env.DB_PORT,
			host:process.env.DB_HOST,
			database: process.env.DB_NAME,
			// url: process.env.DATABASE_URL,
			synchronize: false,
			entities: [__dirname + '/../**/*.entity.{js,ts}'],
			migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
			cli: {
				migrationsDir: __dirname + '/../database/migrations',
			},
			extra: {
				charset: 'utf8mb4_unicode_ci',
				ssl:isProduction ? {rejectUnauthorized:false}: null
			},
		}
	}
}

export const typeOrmConfig: TypeOrmModuleOptions = {
	type: 'postgres',
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	port:process.env.DB_PORT,
	host:process.env.DB_HOST,
	database: process.env.DB_NAME,
	// url: process.env.DATABASE_URL,
	synchronize: false,
	entities: [__dirname + '/../**/*.entity.{js,ts}'],
	migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
	cli: {
		migrationsDir: __dirname + '/../database/migrations',
	},
	extra: {
		charset: 'utf8mb4_unicode_ci',
	},
}
// export default class TypeOrmConfig {
// 	static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
// 		return {
// 			type: 'postgres',
// 			url: configService.get('DATABASE_URL'),
// 			autoLoadEntities: true,
// 			synchronize: true,
// 		}
// 	}
// }

// export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
// 	imports:[ConfigModule],
// 	useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
// 	inject:[ConfigService]
// }