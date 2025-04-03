import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UserUpdateDTO {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
