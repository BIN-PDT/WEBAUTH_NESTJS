import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Request as ExpressRquest } from 'express';
import { MailService } from '../mail/mail.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserCreateDTO } from './dto/user-create.dto';
import { UserPublicDTO } from './dto/user-public.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private createVerificationLink(payload: any, expiry: string, url: string) {
    const token = this.jwtService.sign(payload, {
      expiresIn: expiry,
    });
    return `${url}?token=${token}`;
  }

  async signUpUser(request: ExpressRquest, data: UserCreateDTO) {
    if (await this.usersService.findUserByUsername(data.username)) {
      throw new HttpException(
        'User with username already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (await this.usersService.findUserByEmail(data.email)) {
      throw new HttpException(
        'User with email already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }

    data.password = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.createUser(data);

    const payload = { email: user.email };
    const url = `${request.protocol}://${request.get('host')}/auth/verify-email`;
    const verificationLink = this.createVerificationLink(payload, '15m', url);
    await this.mailService.sendEmailVerification(user.email, verificationLink);

    return plainToInstance(UserPublicDTO, user);
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findUserByUsername(username);
    return user && (await bcrypt.compare(password, user.password))
      ? user
      : null;
  }

  signInUser(data: User) {
    const payload = { sub: data.id, username: data.username };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(
        { ...payload, refresh: true },
        { expiresIn: '2d' },
      ),
    };
  }

  refreshToken(data: User) {
    const payload = { sub: data.id, username: data.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyEmail(token: string) {
    try {
      if (!this.jwtService.verify(token)) {
        throw new HttpException(
          'Invalid verification token.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const { email } = this.jwtService.decode(token);
      const user = await this.usersService.findUserByEmail(email);
      if (!user) {
        throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
      }

      await this.usersService.updateUser(user.id, { isVerified: true });
    } catch {
      throw new HttpException(
        'Invalid verification token.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async requestResetPassword(request: ExpressRquest, email: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) return;

    const payload = { email: user.email };
    const url = `${request.protocol}://${request.get('host')}/auth/confirm-reset-password`;
    const verificationLink = this.createVerificationLink(payload, '15m', url);
    await this.mailService.sendEmailResetPassword(user.email, verificationLink);
  }

  async confirmResetPassword(token: string, password: string) {
    try {
      if (!this.jwtService.verify(token)) {
        throw new HttpException(
          'Invalid verification token.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const { email } = this.jwtService.decode(token);
      const user = await this.usersService.findUserByEmail(email);
      if (!user) {
        throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await this.usersService.updateUser(user.id, { password: hashedPassword });
    } catch {
      throw new HttpException(
        'Invalid verification token.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
