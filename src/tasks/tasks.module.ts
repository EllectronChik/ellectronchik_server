import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schema/task.schema';
import { SubTaskSchema, Subtask } from 'src/subtask/schema/subtask.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Subtask.name, schema: SubTaskSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [TasksResolver, TasksService],
})
export class TasksModule {}
