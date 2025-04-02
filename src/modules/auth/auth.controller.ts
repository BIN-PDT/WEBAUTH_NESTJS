import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDTO } from './dto/user-create.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body(new ValidationPipe()) data: UserCreateDTO) {
    const user = await this.authService.signUpUser(data);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Signed up successfully.',
      data: user,
    };
  }

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  async signIn(@Request() request: Request & { user: User }) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Signed in successfully.',
      data: this.authService.signInUser(request.user),
    };
  }
}
