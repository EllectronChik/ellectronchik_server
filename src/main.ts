import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { GraphQLError } from 'graphql';

async function bootstrap() {
  try {
    const PORT = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule);
    app.use(
      helmet({
        contentSecurityPolicy:
          process.env.NODE_ENV === 'production' ? undefined : false,
      }),
    );

    if (process.env.NODE_ENV === 'development') {
      app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
      });
    }
    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (errors) => {
          const messages = errors.map((error) => {
            return Object.values(error.constraints);
          });
          const message = JSON.stringify(messages);
          return new GraphQLError(message, {
            extensions: {
              code: 'BAD_REQUEST',
            },
          });
        },
      }),
    );
    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
}
bootstrap();
