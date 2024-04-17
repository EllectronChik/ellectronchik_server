import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { GraphQLError } from 'graphql';
import { Model } from 'mongoose';
import { Role, RoleDocument } from 'src/roles/schema/role.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @InjectModel(Role.name) private readonly RoleModel: Model<RoleDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        'roles',
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      const { req } = GqlExecutionContext.create(context).getContext();
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new GraphQLError('Invalid token', {
          extensions: { code: HttpStatus.UNAUTHORIZED },
        });
      }
      const user = await this.jwtService.verifyAsync(token, {
        secret: process.env.PRIVATE_KEY,
      });

      const userRole = await this.RoleModel.findOne({
        _id: { $in: user.role },
      });

      req.user = user;

      if (userRole.name === 'SUPERUSER') {
        return true;
      }

      if (userRole.name === 'ADMIN' && !requiredRoles.includes('SUPERUSER')) {
        return true;
      }

      return requiredRoles.includes(userRole.name);
    } catch (e) {
      throw new GraphQLError('Invalid token', {
        extensions: { code: HttpStatus.UNAUTHORIZED },
      });
    }
  }
}
