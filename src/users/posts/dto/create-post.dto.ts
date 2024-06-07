import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(2, 100)
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  user_id: number;
}
