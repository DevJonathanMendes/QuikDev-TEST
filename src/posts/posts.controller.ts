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

import { Public } from '../auth/decorators/public.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  async create(
    @Req() req: Request & { user: { id: number } },
    @Body() data: CreatePostDto,
  ) {
    if (!req?.user.id) {
      throw new UnauthorizedException([
        'You need to be logged in to create posts',
      ]);
    }

    const user = await this.postsService.findUniqueUserById(req.user.id);
    if (!user) {
      throw new BadRequestException(['user does not exists']);
    }

    data.user_id = req.user.id;
    return this.postsService.create({ ...data });
  }

  @Public()
  @Get()
  findAll() {
    return this.postsService.findMany();
  }

  @Public()
  @Get('user/:id')
  findAllPostsUser(@Param('id', ParseIntPipe) user_id: number) {
    return this.postsService.findAllPostsUser(user_id);
  }

  @Get('user/:user_id/:id')
  async findOnePostUser(
    @Req() req,
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const post = await this.postsService.findOnePostUser(user_id, id);

    if (post) {
      await this.postsService.addView(req.user.id, id);
    }

    return post;
  }

  @Patch(':id')
  async update(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePostDto,
  ) {
    const post = await this.postsService.findUnique(id, req.user.id);

    if (!post) {
      throw new UnauthorizedException(['Post does not exist']);
    }

    return this.postsService.update(id, req.user.id, data);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    const post = await this.postsService.findUnique(id, req.user.id);

    if (!post) return;

    return this.postsService.remove(id, req.user.id);
  }
}
