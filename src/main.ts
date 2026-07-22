import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { envs } from './config';
import { startMetricsServer } from './metrics/metrics';

async function bootstrap() {
  const logger = new Logger('ProductMS-Main');

  // Start the Prometheus metrics HTTP server on a dedicated port (default 9100).
  // This is a plain Node http.Server — completely separate from the RMQ transport.
  // The RMQ microservice below continues to operate exactly as before.
  await startMetricsServer(envs.metricsPort);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [envs.rabbitmqUrl],
        queue: envs.rabbitmqQueue,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  // Global Pipes for validation
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
