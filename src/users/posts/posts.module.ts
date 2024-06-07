import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersService } from '../users.service';
import { CommentsModule } from './comments/comments.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [PrismaModule, CommentsModule],
  controllers: [PostsController],
  providers: [UsersService, PostsService],
  exports: [PostsService],
})
export class PostsModule {}
