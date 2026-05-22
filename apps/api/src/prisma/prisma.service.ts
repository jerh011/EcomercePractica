import { Injectable, OnModuleInit } from '@nestjs/common';
import { prisma } from '@ecomercepractica/db';

@Injectable()
export class PrismaService implements OnModuleInit {
  async onModuleInit() {
    await prisma.$connect();
  }

  get client() {
    return prisma;
  }
}
