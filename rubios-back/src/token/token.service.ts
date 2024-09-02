import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';

import { User } from '../user/entities/user.entity';

import { UserService } from '../user/user.service';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async setRefreshToken(id: string, refreshToken: string) {
    const user = await this.userService.findOne(id);

    return this.userRepository.save({
      ...user,
      refreshToken,
    });
  }

  async getRefreshToken(id: string) {
    const user = await this.userService.findOne(id);

    const token = null
    //user.refreshToken;

    return token;
  }

  async removeRefreshToken(id: string) {
    const user = await this.userService.findOne(id);

    return this.userRepository.save({
      ...user,
      refreshToken: null,
    });
  }

  verifyRefreshToken(refreshToken: string) {
    const decodedId = this.jwtService.verify(refreshToken, {
      secret: 'myRefreshToken',
    });

    return decodedId;
  }

  verifyAccessToken(accessToken: string) {
    const decodedId = this.jwtService.verify(accessToken, {
      secret: 'mySuperSecretKey',
    });

    return decodedId;
  }

  async generateTokens(id: string) {
    console.log("id token: ", id);
    const payload = { id };

    const accessToken = this.jwtService.sign(payload, {
      secret: 'mySuperSecretKey',
      expiresIn: '30m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: 'myRefreshToken',
      expiresIn: '30d',
    });

    await this.setRefreshToken(id, refreshToken);

    return { accessToken, refreshToken };
  }

  async isRefreshTokenValid(refreshToken: string) {
    try {
      const { id } = await this.verifyRefreshToken(refreshToken);
      const storedToken = await this.getRefreshToken(id);

      if (refreshToken === storedToken) {
        return id;
      }
    } catch (e) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
