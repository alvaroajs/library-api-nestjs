import { Controller, Post, Body, Get, Patch, Param, Query } from '@nestjs/common';
import { BooksService } from './books.service';

import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookStatusDto } from './dto/update-book-status.dto';
import { QueryBookDto } from './dto/query-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll(@Query() query: QueryBookDto) {
    return this.booksService.findAll(query);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateBookStatusDto: UpdateBookStatusDto,
  ) {
    return this.booksService.updateStatus(+id, updateBookStatusDto);
  }
}