import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from 'src/roles/schema/role.schema';
import { User } from 'src/users/schema/user.schema';
import * as readline from 'readline';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseInitializerService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async onApplicationBootstrap() {
    const adminRole = await this.roleModel.findOne({ name: 'ADMIN' });
    const userRole = await this.roleModel.findOne({ name: 'USER' });
    const superUserRole = await this.roleModel.findOne({ name: 'SUPERUSER' });
    if (!adminRole) {
      const role = new this.roleModel({
        name: 'ADMIN',
        users: null,
      });
      await role.save();
    }
    if (!userRole) {
      const role = new this.roleModel({
        name: 'USER',
        users: null,
      });
      await role.save();
    }
    if (!superUserRole) {
      const role = new this.roleModel({
        name: 'SUPERUSER',
        users: null,
      });
      await role.save();
      await this.createSuperUser(role);
    } else {
      const superUser = await this.userModel.findOne({
        role: superUserRole._id,
      });
      if (!superUser) {
        await this.createSuperUser(superUserRole);
      }
    }
  }

  private async createSuperUser(superUserRole: RoleDocument) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const name = await new Promise<string>((resolve) => {
      rl.question('Enter superuser name (default: root): ', (name) => {
        resolve(name || 'root');
      });
    });

    const password = await new Promise<string>((resolve) => {
      rl.question('Enter superuser password: ', (password) => {
        resolve(password);
      });
    });

    const passHash = await bcrypt.hash(password, 12);

    const user = new this.userModel({
      name,
      password: passHash,
      role: superUserRole._id,
      rating: 0,
    });
    await user.save();

    superUserRole.users = [user];
    await superUserRole.save();

    rl.close();
  }
}
