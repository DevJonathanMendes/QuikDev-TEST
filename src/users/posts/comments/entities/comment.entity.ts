import { Comment } from '@prisma/client';

export class CommentEntity implements Comment {
  id: number;
  description: string;
  user_id: number;
  post_id: number;
}
