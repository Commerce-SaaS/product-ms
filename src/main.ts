import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, RpcException, Transport } from '@nestjs/microservices';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('ProductMS-Main');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
        raw: false,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map(
          (err) =>
            `${err.constraints ? Object.values(err.constraints).join(', ') : ''}`,
        );
        return new RpcException({
          statusCode: 400,
          message: messages,
        });
      },
    }),
  );

  await app.listen();
  logger.log(`Product Microservice is running on port ${envs.port}`);
}
bootstrap();
