import { Test, TestingModule } from '@nestjs/testing';
import { LoansService } from './loans.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Status } from '../../generated/prisma';

// mock do PrismaService: um objeto falso que imita o PrismaService real
const mockPrismaService = {
  book: {
    findUnique: jest.fn(), 
    update: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  loan: {
    create: jest.fn(),
  },
  $transaction: jest.fn().mockImplementation(callback => callback(mockPrismaService)),
};

// describe agrupa os testes para um componente específico
describe('LoansService', () => {
  let service: LoansService;

  // beforeEach roda antes de cada teste. É usado para resetar o ambiente.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoansService,
        {
          provide: PrismaService, 
          useValue: mockPrismaService, 
        },
      ],
    }).compile();

    service = module.get<LoansService>(LoansService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 'it' define um caso de teste individual. A descrição deve dizer o que se espera.
  it('should successfully create a loan if the book is available', async () => {
    // 1. ARRANJO (Arrange): Preparamos os dados e o comportamento do mock
    const mockBook = { id: 1, status: Status.AVAILABLE };
    const mockUser = { id: 1 };
    const createLoanDto = { bookId: 1, userId: 1 };


    mockPrismaService.book.findUnique.mockResolvedValue(mockBook);
    mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
    mockPrismaService.loan.create.mockResolvedValue({ id: 1, ...createLoanDto });

  
    const result = await service.create(createLoanDto);

    
    expect(result).toBeDefined(); 
    expect(mockPrismaService.book.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockPrismaService.book.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: Status.BORROWED },
    });
    expect(mockPrismaService.loan.create).toHaveBeenCalled();
  });

  it('conflita casso o livro já esteja emprestado', async () => {
   
    const mockBook = { id: 1, status: Status.BORROWED }; // O livro já está emprestado
    const mockUser = { id: 1 };
    const createLoanDto = { bookId: 1, userId: 1 };

    mockPrismaService.book.findUnique.mockResolvedValue(mockBook);
    mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
    
    await expect(service.create(createLoanDto)).rejects.toThrow(ConflictException);
  });
});