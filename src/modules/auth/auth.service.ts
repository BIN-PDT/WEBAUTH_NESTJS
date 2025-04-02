import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserCreateDTO } from './dto/user-create.dto';
import { plainToInstance } from 'class-transformer';
import { UserPublicDTO } from './dto/user-public.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUpUser(data: UserCreateDTO) {
    if (await this.usersService.findUserByUsername(data.username)) {
      throw new HttpException(
        'User with username already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (await this.usersService.findUserByEmail(data.email)) {
      throw new HttpException(
        'User with email already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.usersService.createUser(data);
    return plainToInstance(UserPublicDTO, user);
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findUserByUsername(username);
    return user && (await bcrypt.compare(password, user.password))
      ? user
      : null;
  }

  signInUser(data: User) {
    const payload = { sub: data.id, username: data.username };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(
        { ...payload, refresh: true },
        { expiresIn: '2d' },
      ),
    };
  }

  refreshToken(data: User) {
    const payload = { sub: data.id, username: data.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
