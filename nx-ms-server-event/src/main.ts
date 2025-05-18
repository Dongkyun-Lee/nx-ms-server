import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalErrorFilter } from './common/filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('nx-ms-server-event API')
    .setDescription('이벤트 생성, 보상 정의, 보상 요청 처리, 지급 상태 저장')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalFilters(new GlobalErrorFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
