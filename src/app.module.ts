import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from './roles/roles.module';
import { DatabaseInitializerModule } from './database-initializer/database-initializer.module';
import { RefreshModule } from './refresh/refresh.module';
import { DiaryNotesModule } from './diary-notes/diary-notes.module';
import { TagsModule } from './tags/tags.module';
import { DiaryNotesMediaModule } from './diary-notes-media/diary-notes-media.module';
import { TasksModule } from './tasks/tasks.module';
import { SubtaskModule } from './subtask/subtask.module';
import { GoalsModule } from './goals/goals.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', 'static'),
      serveRoot: '/static',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req, res }) => ({ req, res }),
      driver: ApolloDriver,
      playground: process.env.NODE_ENV !== 'production',
      autoSchemaFile: 'schema.gql',
      subscriptions: {
        'graphql-ws': true,
      }
    }),
    JwtModule.register({
      global: true,
      secret: process.env.PRIVATE_KEY,
      signOptions: { expiresIn: '15m' },
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    RolesModule,
    DatabaseInitializerModule,
    RefreshModule,
    DiaryNotesModule,
    TagsModule,
    DiaryNotesMediaModule,
    TasksModule,
    SubtaskModule,
    GoalsModule,
  ],
  providers: [],
})
export class AppModule {}
