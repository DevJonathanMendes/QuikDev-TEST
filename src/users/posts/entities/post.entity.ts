import { Post } from '@prisma/client';

export class PostEntity implements Post {
  id: number;
  title: string;
  description: string;
  user_id: number;
}
