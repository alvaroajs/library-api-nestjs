import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Corrigi o caminho para o padrão
import { CreateLoanDto } from './dto/create-loan.dto';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  // --- MÉTODO PARA CRIAR UM EMPRÉSTIMO ---
  async create(createLoanDto: CreateLoanDto) {
    const { bookId, userId } = createLoanDto;

    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException(`Livro com ID ${bookId} não encontrado.`);
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${userId} não encontrado.`);
    }

    if (book.status === 'BORROWED') {
      throw new ConflictException('Este livro já está emprestado.');
    }

    // A transação garante que as duas operações aconteçam juntas
    return this.prisma.$transaction(async (tx) => {
      await tx.book.update({
        where: { id: bookId },
        data: { status: 'BORROWED' },
      });

      const newLoan = await tx.loan.create({
        data: {
          bookId,
          userId,
        },
      });

      return newLoan;
    });
  }

  // --- MÉTODO PARA DEVOLVER UM LIVRO ---
  async returnBook(id: number) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
    });

    if (!loan) {
      throw new NotFoundException(`Empréstimo com ID ${id} não encontrado.`);
    }

    if (loan.returnDate) {
      throw new ConflictException('Este livro já foi devolvido.');
    }

    return this.prisma.$transaction(async (tx) => {
      // Atualiza o status do livro para AVAILABLE
      await tx.book.update({
        where: { id: loan.bookId },
        data: { status: 'AVAILABLE' },
      });

      // Atualiza o empréstimo com a data de devolução
      const updatedLoan = await tx.loan.update({
        where: { id },
        data: { returnDate: new Date() },
      });

      return updatedLoan;
    });
  }
}