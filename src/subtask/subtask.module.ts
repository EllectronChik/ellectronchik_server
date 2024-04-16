import { Module } from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { SubtaskResolver } from './subtask.resolver';
import { Subtask, SubTaskSchema } from './schema/subtask.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from 'src/tasks/schema/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subtask.name, schema: SubTaskSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  providers: [SubtaskResolver, SubtaskService],
})
export class SubtaskModule {}
