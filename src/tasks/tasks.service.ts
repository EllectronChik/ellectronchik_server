import { Injectable } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schema/task.schema';
import { Model } from 'mongoose';
import { Subtask, SubtaskDocument } from 'src/subtask/schema/subtask.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Subtask.name) private subtaskModel: Model<SubtaskDocument>,
  ) {}

  create(createTaskInput: CreateTaskInput, userId: string) {
    return this.taskModel.create({ userId, ...createTaskInput });
  }

  findAllByUser(userId: string) {
    return this.taskModel.find({ userId });
  }

  findOne(id: string, userId: string) {
    return this.taskModel
      .findOne({ _id: id, userId })
      .populate('tags')
      .populate('subtasks');
  }

  update(id: string, userId: string, updateTaskInput: UpdateTaskInput) {
    return this.taskModel.findOneAndUpdate(
      { _id: id, userId },
      updateTaskInput,
      { new: true },
    );
  }

  async remove(id: string, userId: string) {
    try {
      const deletedTask = await this.taskModel.findOneAndDelete({
        _id: id,
        userId,
      });

      await this.subtaskModel.deleteMany({ taskId: deletedTask._id });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
