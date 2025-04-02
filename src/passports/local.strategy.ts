import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  Dependencies,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
@Dependencies(AuthService)
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new HttpException('Invalid credentails.', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
