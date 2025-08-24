import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '../../../generated/prisma';

export class UpdateBookStatusDto {
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}
