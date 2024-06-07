import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, PostsModule],
})
export class AppModule {}
