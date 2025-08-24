import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { QueryBookDto } from './dto/query-book.dto';
import { UpdateBookStatusDto } from './dto/update-book-status.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  create(createBookDto: CreateBookDto) {
    console.log('Estou dentro do método create correto!'); 
    return this.prisma.book.create({
      data: createBookDto,

    });
  }

  findAll(query: QueryBookDto) {
    const { status, title } = query;
    const where = {};

    if (status) {
      where['status'] = status;
    }

    if (title) {
      where['title'] = {
        contains: title,
        mode: 'insensitive',
      };
    }

    return this.prisma.book.findMany({ where });
  }

  async updateStatus(id: number, updateBookStatusDto: UpdateBookStatusDto) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Livro com ID ${id} não encontrado.`);
    }

    return this.prisma.book.update({
      where: { id },
      data: {
        status: updateBookStatusDto.status,
      },
    });
  }
}