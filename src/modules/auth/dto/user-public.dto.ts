import { Exclude, Expose } from 'class-transformer';

export class UserPublicDTO {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Exclude()
  password: string;

  @Expose()
  email: string;

  @Expose()
  isVerified: boolean;

  @Expose()
  isActive: boolean;

  @Expose()
  dateJoined: Date;
}
