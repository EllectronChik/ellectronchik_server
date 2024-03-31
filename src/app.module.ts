import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config();

const __DATABASE_URL__ = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

@Module({
  imports: [
    MongooseModule.forRoot(__DATABASE_URL__),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', 'static'),
      serveRoot: '/static',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: process.env.NODE_ENV !== 'production',
    }),
  ],
})
export class AppModule {}
