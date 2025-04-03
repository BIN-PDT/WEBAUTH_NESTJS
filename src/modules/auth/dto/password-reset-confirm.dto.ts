import { IsString } from 'class-validator';

export class PasswordResetConfirmDTO {
  @IsString()
  password: string;
}
