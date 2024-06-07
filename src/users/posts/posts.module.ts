import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { UsersService } from '../users.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostsController],
  providers: [PostsService, UsersService],
})
export class PostsModule {}
