import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { UserModule } from './user/user.module'; // Ou UsersModule, dependendo de como ficou
import { LoansModule } from './loans/loans.module';
import { PrismaModule } from './prisma/prisma.module'; // <-- IMPORTE AQUI

@Module({
  imports: [
    PrismaModule,
    BooksModule,
    UserModule,
    LoansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}