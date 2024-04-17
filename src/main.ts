import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

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
    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
}
bootstrap();
