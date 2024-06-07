import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  create(data: CreatePostDto) {
    return this.prisma.post.create({ data });
  }

  findMany() {
    return this.prisma.post.findMany();
  }

  findUnique(id: number, user_id: number): Promise<PostEntity> {
    return this.prisma.post.findUnique({
      where: { id, AND: { user_id } },
    });
  }

  update(id: number, user_id: number, data: UpdatePostDto) {
    return this.prisma.post.update({ where: { id, AND: { user_id } }, data });
  }

  async findOnePostUser(user_id: number, id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id, user_id },
    });

    // Existe outra forma para a contagem de views, mas a formação é ruim.
    // Decisão tomada meramente por estética, já que não há demanda de performance.
    if (post) {
      const views = await this.prisma.view.count({ where: { post_id: id } });
      return { ...post, views };
    }

    return post;
  }

  findAllPostsUser(user_id: number) {
    return this.prisma.post.findMany({
      where: { user_id },
    });
  }

  findUniqueUserById(id: number): Promise<Partial<UserEntity>> {
    return this.usersService.findUniqueById(id);
  }

  remove(id: number, user_id: number) {
    return this.prisma.post.delete({ where: { id, AND: { user_id } } });
  }

  async addView(user_id: number, post_id: number) {
    const existingView = await this.prisma.view.findFirst({
      where: { user_id, post_id },
    });

    if (existingView) return;

    return this.prisma.view.create({ data: { user_id, post_id } });
  }
}
