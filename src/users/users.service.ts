import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateUserDto): Promise<UserEntity> {
    return this.prisma.user.create({ data });
  }

  findAll(): Promise<Partial<UserEntity>[]> {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });
  }

  findMany(...data: Partial<UpdateUserDto>[]): Promise<Partial<UserEntity>[]> {
    return this.prisma.user.findMany({
      where: { OR: [...data] },
      select: { email: true },
    });
  }

  findUniqueById(id: number): Promise<Partial<UserEntity>> {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
  }

  findUniqueByEmail(
    email: string,
    select?: Prisma.UserSelect,
  ): Promise<Partial<UserEntity>> {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, ...select },
    });
  }

  update(id: number, data: UpdateUserDto): Promise<UserEntity> {
    return this.prisma.user.update({ where: { id }, data });
  }

  delete(id: number): Promise<UserEntity> {
    return this.prisma.user.delete({ where: { id } });
  }
}
