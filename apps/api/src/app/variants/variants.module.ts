import { Module } from '@nestjs/common';
import { PaginationModule } from '../common/pagination/pagination.module';
import { InventoryModule } from '../inventory/inventory.module';
import { PrismaService } from '../../prisma/prisma.service';
import { VariantsController } from './variants.controller';
import { VariantsService } from './variants.service';

@Module({
  imports: [PaginationModule, InventoryModule],
  controllers: [VariantsController],
  providers: [VariantsService, PrismaService],
  exports: [VariantsService],
})
export class VariantsModule {}
