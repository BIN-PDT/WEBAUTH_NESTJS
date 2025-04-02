import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Dependencies,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
@Dependencies(ConfigService, UsersService)
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    configSerivce: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const SECRET_KEY = configSerivce.get<string>('SECRET_KEY');
    if (!SECRET_KEY) {
      throw new InternalServerErrorException(
        'SECRET_KEY is not defined in .env file.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: SECRET_KEY,
    });
  }

  async validate(payload: any) {
    if (!payload.refresh) {
      throw new HttpException('Invalid refresh token.', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findUserByUsername(payload.username);
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
