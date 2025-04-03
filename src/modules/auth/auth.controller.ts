import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDTO } from './dto/user-create.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';
import { Request as ExpressRquest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Request() request: ExpressRquest,
    @Body(new ValidationPipe()) data: UserCreateDTO,
  ) {
    const user = await this.authService.signUpUser(request, data);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Signed up successfully.',
      data: user,
    };
  }

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  async signIn(@Request() request: ExpressRquest & { user: User }) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Signed in successfully.',
      data: this.authService.signInUser(request.user),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/signout')
  signout() {
    // REVOKE TOKEN HERE.
    return {
      statusCode: HttpStatus.OK,
      message: 'Signed out successfully.',
    };
  }

  @UseGuards(AuthGuard('refresh-jwt'))
  @Get('/refresh-token')
  refreshToken(@Request() request: ExpressRquest & { user: User }) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Refreshed token successfully.',
      data: this.authService.refreshToken(request.user),
    };
  }

  @Get('/verify-email')
  async verifyEmail(@Query('token') token: string) {
    await this.authService.verifyEmail(token);
    return {
      statusCode: HttpStatus.OK,
      message: 'Verified account successfully.',
    };
  }
}
