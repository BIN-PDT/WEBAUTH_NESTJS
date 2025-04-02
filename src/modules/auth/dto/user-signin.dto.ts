import { IsString } from 'class-validator';

export class UserSignInDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
