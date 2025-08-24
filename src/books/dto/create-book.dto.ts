import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsInt()
  @IsNotEmpty()
  publishedYear: number;
}