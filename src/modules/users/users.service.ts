import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreateDTO } from '../auth/dto/user-create.dto';
import { UserUpdateDTO } from '../auth/dto/user-update.dto';
import { User } from './entities/user.entity';

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

  createUser(data: UserCreateDTO) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  updateUser(id: number, data: UserUpdateDTO) {
    return this.userRepository.update(id, data);
  }
}
