import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserCreateDTO } from './dto/user-create.dto';
import { plainToInstance } from 'class-transformer';
import { UserPublicDTO } from './dto/user-public.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
}
