import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '../../generated/prisma';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Tenta criar o usuário no banco de dados
      return await this.prisma.user.create({
        data: createUserDto,
      });
    } catch (error) {
      // Se o erro for de "email já existe" (código P2002 do Prisma)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('O email informado já está em uso.');
      }
      // Se for outro tipo de erro, apenas o relança
      throw error;
    }
  }
}
