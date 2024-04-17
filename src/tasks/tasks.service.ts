import { Injectable } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schema/task.schema';
import { Model } from 'mongoose';
import { Subtask, SubtaskDocument } from 'src/subtask/schema/subtask.schema';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Subtask.name) private subtaskModel: Model<SubtaskDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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

  async update(id: string, userId: string, updateTaskInput: UpdateTaskInput) {
    const task = await this.taskModel.findOneAndUpdate(
      { _id: id, userId },
      updateTaskInput,
      { new: true },
    );
    if (updateTaskInput.completed !== undefined) {
      if (updateTaskInput.completed) {
        return this.userModel.findOne({ _id: userId }).then((user) => {
          let points = task.points;
          if (task.isOverdue) {
            points /= 2;
          }
          user.rating += points;
          user.save();
        });
      } else {
        return this.userModel.findOne({ _id: userId }).then((user) => {
          let points = task.points;
          if (task.isOverdue) {
            points /= 2;
          }
          user.rating -= points;
          user.save();
        });
      }
    }
    return task;
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

  async scheduleTaskCompletion(id: string, userId: string, date: Date) {
    const currentDate = new Date();
    const task = await this.taskModel.findOne({ _id: id, userId });
    if (task && currentDate > date && !task.completed) {
      task.isOverdue = true;
      task.save();
      return true;
    }
  }

  @Interval(1000 * 60)
  async checkOverdueTasks() {
    const currentDate = new Date();

    const tasks = await this.taskModel.find({
      dueDate: { $lt: currentDate },
      isOverdue: false,
      completed: false,
    });

    for (const task of tasks) {
      task.isOverdue = true;
      task.save();
    }
  }
}
