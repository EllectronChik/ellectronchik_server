import { Injectable } from '@nestjs/common';
import { CreateSubtaskInput } from './dto/create-subtask.input';
import { UpdateSubtaskInput } from './dto/update-subtask.input';
import { Subtask, SubtaskDocument } from './schema/subtask.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from 'src/tasks/schema/task.schema';

@Injectable()
export class SubtaskService {
  constructor(
    @InjectModel(Subtask.name) private subtaskModel: Model<SubtaskDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async create(createSubtaskInput: CreateSubtaskInput, userId: string) {
    const task = await this.taskModel.findOne({ _id: createSubtaskInput.taskId });
    const subtask = await this.subtaskModel.create({ ...createSubtaskInput, userId });
    if (task) {
      task.subtasks.push(subtask);
      task.save();
    }
    return subtask;
  }

  findAllByTask(taskId: string, userId: string) {
    return this.subtaskModel.find({ taskId, userId });
  }

  findOne(id: number, userId: string) {
    return this.subtaskModel.findOne({ _id: id, userId });
  }

  update(id: string, userId: string, updateSubtaskInput: UpdateSubtaskInput) {
    return this.subtaskModel.findOneAndUpdate(
      { _id: id, userId },
      updateSubtaskInput,
    );
  }

  async remove(id: string, userId: string) {
    try {
      const deletedSubtask = await this.subtaskModel.findOneAndDelete({ _id: id, userId });
      const task = await this.taskModel.findOne({ _id: deletedSubtask.taskId });
      if (task) {
        task.subtasks = task.subtasks.filter((subtask) => subtask._id !== deletedSubtask._id);
        task.save();
      }
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  }
}
