import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/roles/schema/role.schema';

@Injectable()
export class DatabaseInitializerService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async onApplicationBootstrap() {
    const adminRole = await this.roleModel.findOne({ name: 'admin' });
    const userRole = await this.roleModel.findOne({ name: 'user' });
    if (!adminRole) {
      const role = new this.roleModel({
        name: 'admin',
        users: null,
      });
      await role.save();
    }
    if (!userRole) {
      const role = new this.roleModel({
        name: 'user',
        users: null,
      });
      await role.save();
    }
  }
}
