import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UserEntity } from '../users/entities/user.entity';

type IUserToken = {
  id: number;
  email: string;
  token: string;
};

interface SignToken {
  (user: Partial<UserEntity>, data?: UpdateUserDto): IUserToken;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  signToken: SignToken = (user, data = null) => {
    if (data)
      if (data.password !== user.password) {
        throw new UnauthorizedException(['Incorrect password']);
      }

    return this.createPayload(user);
  };

  private createPayload({ id, email }: Partial<UserEntity>): IUserToken {
    const payload = { id, email };

    return {
      ...payload,
      token: this.jwtService.sign({ ...payload }),
    };
  }
}
