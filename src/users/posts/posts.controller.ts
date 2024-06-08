import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('users/:user_id/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('report')
  async report(
    @Req() req: Request & { user: { id: number } },
    @Param('user_id', ParseIntPipe) user_id: number,
  ) {
    // Evitaria uma chamada ao DB.
    if (user_id !== req.user.id) {
      throw new UnauthorizedException([
        "You are not allowed to view other users' post report.",
      ]);
    }

    const posts = await this.postsService.postReport(user_id);

    // Mas ficaria repetitivo.
    // Para garantir.
    if (posts[0].user_id !== req.user.id) {
      throw new UnauthorizedException([
        "You are not allowed to view other users' post report.",
      ]);
    }

    return posts.map((post) => ({
      title: post.title,
      commentCount: post._count.comment,
      views: post.views,
    }));
  }

  @Post()
  async create(
    @Req() req: Request & { user: { id: number } },
    @Param('user_id', ParseIntPipe) user_id: number,
    @Body() data: CreatePostDto,
  ) {
    const user = await this.postsService.findOneUserById(user_id);

    if (!user) {
      throw new BadRequestException(['User does not exists']);
    }

    if (user.id !== req.user.id) {
      throw new UnauthorizedException([
        'You do not have permission to create a post under this user',
        'Please log in again or try later.',
      ]);
    }

    data.user_id = req.user.id;
    return this.postsService.createPost({ ...data });
  }

  @Get()
  findAllPostsUser(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.postsService.findAllPostsUser(user_id);
  }

  @Get(':post_id')
  findOnePostUser(
    @Req() req: Request & { user: { id: number } },
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('post_id', ParseIntPipe) post_id: number,
  ) {
    return this.postsService.findUniquePost(req.user.id, user_id, post_id);
  }

  // Parece redundante (se parece com create), algumas operações se repetem entre chamadas para verificar a autenticidade.
  // Sugestão de Refatoração: melhorar no tratamento de erros afim de evitar chamadas no banco de dados. (Mensurar performance antes)
  @Patch(':post_id')
  async update(
    @Req() req: Request & { user: { id: number } },
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('post_id', ParseIntPipe) post_id: number,
    @Body() data: UpdatePostDto,
  ) {
    const user = await this.postsService.findOneUserById(user_id);

    if (!user) {
      throw new BadRequestException(['User does not exists']);
    }

    if (user.id !== req.user.id) {
      throw new UnauthorizedException([
        'You do not have permission to create a post under this user',
        'Please log in again or try later.',
      ]);
    }

    const post = await this.postsService.findUniquePost(
      req.user.id,
      user_id,
      post_id,
    );

    if (!post) {
      throw new BadRequestException(['Post does not exist']);
    }

    data.user_id = req.user.id;
    return this.postsService.updatePost(req.user.id, post_id, data);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':post_id')
  async remove(
    @Req() req: Request & { user: { id: number } },
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('post_id', ParseIntPipe) post_id: number,
  ) {
    const post = await this.postsService.findUniquePost(
      req.user.id,
      user_id,
      post_id,
    );

    if (!post || req.user.id !== post.user_id) return;

    return this.postsService.removePost(req.user.id, post_id);
  }
}
