import { Module } from '@nestjs/common';
import { MailModule } from '../../../mail/mail.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { UsersService } from '../../users.service';
import { PostsService } from '../posts.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [CommentsController],
  providers: [UsersService, PostsService, CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
