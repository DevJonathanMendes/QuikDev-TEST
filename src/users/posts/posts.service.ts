import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../users.service';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  createPost(data: CreatePostDto): Promise<PostEntity> {
    return this.prisma.post.create({ data });
  }

  findManyPost(): Promise<PostEntity[]> {
    return this.prisma.post.findMany();
  }

  async findUniquePost(
    req_user_id: number,
    user_id: number,
    post_id: number,
  ): Promise<PostEntity | (PostEntity & { views: {} })> {
    const post = await this.prisma.post.findUnique({
      where: { id: post_id, user_id },
    });

    // Existe outra forma para a contagem de views, mas a formatação é ruim.
    // Decisão tomada meramente por estética na resposta, já que não há demanda de performance.
    if (post) {
      await this.addViewPost(req_user_id, post_id);
      const views = await this.prisma.view.count({ where: { post_id } });

      return { ...post, views };
    }

    return post;
  }

  updatePost(
    user_id: number,
    id: number,
    data: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.prisma.post.update({ where: { id, user_id }, data });
  }

  findAllPostsUser(user_id: number): Promise<PostEntity[]> {
    return this.prisma.post.findMany({
      where: { user_id },
    });
  }

  removePost(user_id: number, id: number) {
    return this.prisma.post.delete({ where: { id, user_id } });
  }

  findOneUserById(user_id: number): Promise<Partial<UserEntity>> {
    return this.usersService.findUniqueById(user_id);
  }

  async addViewPost(user_id: number, post_id: number) {
    const existingView = await this.prisma.view.findFirst({
      where: { user_id, post_id },
    });

    if (existingView) return;

    return this.prisma.view.create({ data: { user_id, post_id } });
  }
}
