import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	// setGlobalPrefix is used to set '/api' for all routes
	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle('Blue Pages API')
		.setDescription('Blue Pages API description')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	app.setGlobalPrefix('api');
	app.useGlobalInterceptors(new TransformInterceptor())
	useContainer(app.select(AppModule), { fallbackOnErrors: true });
	const port = process.env.PORT || 4000;
  await app.listen(port);

}

bootstrap();
