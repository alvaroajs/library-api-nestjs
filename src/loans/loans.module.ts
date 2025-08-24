import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // <-- 1. Importe o PrismaModule

@Module({
  imports: [PrismaModule], // <-- 2. Adicione o PrismaModule aqui na lista de imports
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}