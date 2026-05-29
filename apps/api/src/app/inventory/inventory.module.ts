import { Module } from '@nestjs/common';
import { PaginationModule } from '../common/pagination/pagination.module';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
  imports: [PaginationModule],
  controllers: [InventoryController],
  providers: [InventoryService, PrismaService],
  exports: [InventoryService],
})
export class InventoryModule {}
