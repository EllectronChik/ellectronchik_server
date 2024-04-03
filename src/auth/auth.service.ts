import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/CreateUserDto';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/users/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(userDto: CreateUserDto): Promise<{ accessToken: string }> {
    const candidate = await this.usersService.findOne(userDto.name);
    if (candidate) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const passHash = await bcrypt.hash(userDto.password, 12);
    const user = await this.usersService.create({
      ...userDto,
      password: passHash,
    });

    return this.generateToken(user);
  }

  async signIn(userDto: CreateUserDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOne(userDto.name);
    
    const isMatch = await bcrypt.compare(userDto.password, user.password);    

    if (user && isMatch) {
      return this.generateToken(user);
    }

    throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
  }

  private async generateToken(
    user: UserDocument,
  ): Promise<{ accessToken: string }> {
    const payload = { username: user.name, sub: user._id, role: user.role, rating: user.rating };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
