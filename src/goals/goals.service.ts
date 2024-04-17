import { Injectable } from '@nestjs/common';
import { CreateGoalInput } from './dto/create-goal.input';
import { UpdateGoalInput } from './dto/update-goal.input';
import { InjectModel } from '@nestjs/mongoose';
import { Goal, GoalDocument } from './schema/goal.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schema/user.schema';

@Injectable()
export class GoalsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Goal.name) private readonly goalModel: Model<GoalDocument>,
  ) {}

  create(createGoalInput: CreateGoalInput, userId: string) {
    return this.goalModel.create({
      ...createGoalInput,
      userId,
      completed: false,
    });
  }

  findAllByUserId(userId: string) {
    return this.goalModel.find({ userId });
  }

  findOne(id: number, userId: string) {
    return this.goalModel.findOne({ _id: id, userId });
  }

  async update(id: number, updateGoalInput: UpdateGoalInput, userId: string) {
    const goal = await this.goalModel.findOneAndUpdate(
      { _id: id },
      updateGoalInput,
      { new: true },
    );
    if (updateGoalInput.completed !== undefined) {
      if (updateGoalInput.completed) {
        return this.userModel.findOne({ _id: userId }).then((user) => {
          user.rating += goal.points;
          user.save();
        });
      } else {
        return this.userModel.findOne({ _id: userId }).then((user) => {
          user.rating -= goal.points;
          user.save();
        });
      }
    }
    return goal;
  }

  remove(id: number, userId: string) {
    return this.goalModel.deleteOne({ _id: id, userId });
  }
}
