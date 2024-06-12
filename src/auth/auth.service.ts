import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { UserToken } from './entities/token.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  signToken = (user: Partial<UserEntity>, data: UpdateUserDto = null) => {
    if (data && data?.password !== user.password) {
      throw new UnauthorizedException(['Incorrect password']);
    }

    return this.createPayload(user);
  };

  private createPayload({ id, email }: Partial<UserEntity>): UserToken {
    const payload = { id, email };

    return {
      ...payload,
      token: this.jwtService.sign({ ...payload }),
    };
  }
}
