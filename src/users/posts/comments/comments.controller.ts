import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Controller('users/:user_id/posts/:post_id/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Req() req: Request & { user: { id: number } },
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('post_id', ParseIntPipe) post_id: number,
    @Body() data: CreateCommentDto,
  ): Promise<CommentEntity> {
    const post = await this.commentsService.findUniquePost(
      req.user.id,
      user_id,
      post_id,
    );

    if (!post) {
      throw new BadRequestException(['Post dows not exists']);
    }

    return this.commentsService.createComment(req.user.id, post_id, data);
  }

  @Get()
  findAll(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('post_id', ParseIntPipe) post_id: number,
  ): Promise<CommentEntity[]> {
    return this.commentsService.findAllComments(user_id, post_id);
  }

  @Get(':comment_id')
  findOne(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('post_id', ParseIntPipe) post_id: number,
    @Param('comment_id', ParseIntPipe) comment_id: number,
  ) {
    return this.commentsService.findUniqueComment(user_id, post_id, comment_id);
  }

  /* @Get(':comment_id')
  findWithFilter(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('post_id', ParseIntPipe) post_id: number,
    @Param('comment_id', ParseIntPipe) comment_id: number,
  ) {
    // return this.commentsService.findUniqueComment(user_id, post_id, comment_id);
  } */

  @Patch(':comment_id')
  async update(
    @Req() req: Request & { user: { id: number } },
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('post_id', ParseIntPipe) post_id: number,
    @Param('comment_id', ParseIntPipe) comment_id: number,
    @Body() data: UpdateCommentDto,
  ) {
    const comment = await this.commentsService.findUniqueComment(
      req?.user.id,
      post_id,
      comment_id,
    );

    if (!comment) {
      return;
    }

    return this.commentsService.updateComment(
      user_id,
      post_id,
      comment_id,
      data,
    );
  }

  // Há uma "gambiarra" para o dono do Post também poder apagar o comentário.
  @Delete(':comment_id')
  async remove(
    @Req() req: Request & { user: { id: number } },
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('post_id', ParseIntPipe) post_id: number,
    @Param('comment_id', ParseIntPipe) comment_id: number,
  ) {
    const commentByReqUserId = await this.commentsService.findUniqueComment(
      req.user.id,
      post_id,
      comment_id,
    );

    const commentByUser_id = await this.commentsService.findUniqueComment(
      user_id,
      post_id,
      comment_id,
    );

    if (!commentByReqUserId && !commentByUser_id) {
      return ['Comment does not exists'];
    }

    const post = await this.commentsService.findUniquePostById(post_id);

    if (post) {
      if (
        commentByReqUserId?.post_id === post.id ||
        commentByUser_id?.post_id === post.id
      ) {
        if (
          req.user.id === commentByUser_id?.user_id ||
          req.user.id === commentByReqUserId?.user_id ||
          req.user.id === post.user_id
        ) {
          return this.commentsService.removeComment(
            user_id,
            post_id,
            comment_id,
          );
        }
      }
    }

    throw new BadGatewayException([
      'Comment or Post does not exist or you do not have permission to remove it.',
    ]);
  }
}
