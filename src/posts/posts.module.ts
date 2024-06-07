import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';

import { PrismaModule } from '../prisma/prisma.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}