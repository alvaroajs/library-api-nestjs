import { Injectable, OnModuleInit } from '@nestjs/common';
// O caminho abaixo é crucial. Ele sai de 'src/prisma' para a raiz do projeto 
// e entra na pasta 'generated' que o Prisma criou.
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}