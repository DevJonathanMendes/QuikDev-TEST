import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PostsService } from '../posts.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postService: PostsService,
  ) {}

  createComment(
    user_id: number,
    post_id: number,
    { description }: Partial<CreateCommentDto>,
  ) {
    return this.prisma.comment.create({
      data: {
        post_id,
        user_id,
        description,
      },
    });
  }

  findAllComments(user_id: number, post_id: number) {
    return this.prisma.comment.findMany({
      where: { OR: [{ user_id, post_id }] },
    });
  }

  findUniqueComment(user_id: number, post_id: number, comment_id: number) {
    return this.prisma.comment.findUnique({
      where: { id: comment_id, user_id, post_id },
    });
  }

  /* findWithFilterComment(user_id: number, post_id: number) {
    return this.prisma.comment.findMany({
      where: { user_id, post_id },
    });
  } */

  findUniquePostById(post_id: number) {
    return this.postService.findUniquePostById(post_id);
  }

  findUniquePost(req_user_id: number, user_id: number, post_id: number) {
    return this.postService.findUniquePost(req_user_id, user_id, post_id);
  }

  updateComment(
    user_id: number,
    post_id: number,
    id: number,
    data: UpdateCommentDto,
  ) {
    return this.prisma.comment.update({
      where: { id, user_id, post_id },
      data,
    });
  }

  removeComment(user_id: number, post_id: number, id: number) {
    return this.prisma.comment.delete({ where: { id, user_id, post_id } });
  }
}
