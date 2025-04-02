import {
  Body,
  Controller,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDTO } from './dto/user-create.dto';

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
}
