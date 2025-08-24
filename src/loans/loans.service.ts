import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async create(createLoanDto: CreateLoanDto) {
    const { bookId, userId } = createLoanDto;

    // 1. Verificar se o livro e o usuário existem
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException(`Livro com ID ${bookId} não encontrado.`);
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${userId} não encontrado.`);
    }

    // 2. Verificar se o livro já está emprestado (regra de negócio principal)
    if (book.status === 'BORROWED') {
      throw new ConflictException('Este livro já está emprestado.'); // [cite: 2, 21]
    }

    // 3. Executar as duas operações de escrita dentro de uma transação
    const loan = await this.prisma.$transaction(async (tx) => {
      // Marcar o livro como emprestado
      await tx.book.update({
        where: { id: bookId },
        data: { status: 'BORROWED' },
      });

      // Criar o registro do empréstimo
      const newLoan = await tx.loan.create({
        data: {
          bookId,
          userId,
        },
      });

      return newLoan;
    });

    return loan;
  }

  async returnBook(id: number) {
    // 1. Verificar se o empréstimo existe e pegar o bookId
    const loan = await this.prisma.loan.findUnique({
      where: { id },
    });

    if (!loan) {
      throw new NotFoundException(`Empréstimo com ID ${id} não encontrado.`);
    }

    // 2. Verificar se o livro já foi devolvido
    if (loan.returnDate) {
      throw new ConflictException('Este livro já foi devolvido.');
    }

    // 3. Usar uma transação para atualizar o empréstimo e o status do livro
    const updatedLoan = await this.prisma.$transaction(async (tx) => {
      // Marcar o livro como disponível novamente
      await tx.book.update({
        where: { id: loan.bookId },
        data: { status: 'AVAILABLE' },
      });

      // Registrar a data de devolução no empréstimo
      const returnedLoan = await tx.loan.update({
        where: { id },
        data: {
          returnDate: new Date(),
        },
      });

      return returnedLoan;
    });

    return updatedLoan;
  }



}