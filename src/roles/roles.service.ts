import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schema/role.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schema/user.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findOne(name: string): Promise<RoleDocument> {
    return this.roleModel.findOne({ name });
  }

  async findAll(): Promise<RoleDocument[]> {
    return this.roleModel.find();
  }

  async removeUserFromRole(userId: string, roleName: string): Promise<boolean> {
    const role = await this.roleModel.findById(roleName);
    role.users = role.users.filter((user) => user.toString() !== userId);
    return !!(await role.save());
  }

  async addUserToRole(userId: string, roleName: string): Promise<boolean> {
    const role = await this.roleModel.findById(roleName);
    const user = await this.userModel.findById(userId);
    if (!role || !user) {
      return false;
    }
    if (role.users.includes(user)) {
      return false;
    }
    role.users.push(user);
    return !!(await role.save());
  }
}
