import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/CreateUserDto';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private RolesService: RolesService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const userRole = await this.RolesService.findOne('user');
    const user = await this.userModel.create({
      ...dto,
      rating: 0,
      role: userRole._id,
    });
    if (userRole.users) {
      userRole.users.push(user);
    } else {
      userRole.users = [user];
    }
    await userRole.save();
    return user;
  }

  async findOne(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ name: username });
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async remove(id: string): Promise<boolean> {
    const user = await this.userModel.findById(id);
    await this.RolesService.removeUserFromRole(id, user.role.name);
    return !!(await user.deleteOne());
  }
}
