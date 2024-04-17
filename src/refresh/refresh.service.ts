import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Refresh } from './schema/refresh.schema';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { GraphQLError } from 'graphql';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshService {
  constructor(
    @InjectModel(Refresh.name) private refreshModel: Model<Refresh>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(userId: string): Promise<Refresh> {
    const tokenByUser = await this.refreshModel.findOne({ userId: userId });
    const token = uuidv4();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 20);
    if (tokenByUser) {
      tokenByUser.refreshToken = token;
      tokenByUser.expires = expirationDate;
      return await tokenByUser.save();
    }
    return await this.refreshModel.create({
      refreshToken: token,
      userId: userId,
      expires: expirationDate,
    });
  }

  async reValidate(
    userId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenByUser = await this.refreshModel.findOne({ userId: userId });
    const currentDate = new Date();
    if (
      tokenByUser &&
      tokenByUser.refreshToken === refreshToken &&
      tokenByUser.expires > currentDate
    ) {
      const { refreshToken: newToken } = await this.create(userId);
      const { accessToken } = await this.generateToken(
        await this.userModel.findById(userId),
      );
      return {
        accessToken: accessToken,
        refreshToken: newToken,
      };
    }
    throw new GraphQLError('Invalid refresh token', {
      extensions: { code: HttpStatus.UNAUTHORIZED },
    });
  }

  private async generateToken(
    user: UserDocument,
  ): Promise<{ accessToken: string }> {
    const payload = {
      username: user.name,
      sub: user._id,
      role: user.role,
      rating: user.rating,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
