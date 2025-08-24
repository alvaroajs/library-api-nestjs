import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Status } from '../../../generated/prisma';

export class QueryBookDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsString()
  title?: string;
}