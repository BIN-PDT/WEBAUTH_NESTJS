import { IsString, IsEmail, MaxLength, Matches } from 'class-validator';

export class UserCreateDTO {
  @IsString()
  @MaxLength(150)
  @Matches(/^[a-zA-Z0-9_@+.-]+$/)
  username: string;

  @IsString()
  @MaxLength(150)
  password: string;

  @IsEmail()
  @MaxLength(150)
  email: string;
}
