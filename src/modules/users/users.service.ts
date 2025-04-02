import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserCreateDTO } from '../auth/dto/user-create.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findUserByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async createUser(data: UserCreateDTO) {
    const user = this.userRepository.create(data);
    user.password = await bcrypt.hash(user.password, 10);

    return this.userRepository.save(user);
  }
}
