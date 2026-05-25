import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationModule } from '../common/pagination/pagination.module';
import { CategoriesModule } from '../categories/categories.module';
// import { BrandsModule } from '../brands/brands.module';
// import { WarehousesModule } from '../warehouses/warehouses.module';
// import { StoreSettingsModule } from '../store-settings/store-settings.module';
import { CompositeController } from './composite.controller';
import { CompositeService } from './composite.service';

@Module({
  imports: [
    PaginationModule,
    CategoriesModule,
    // BrandsModule,
    // WarehousesModule,
    // StoreSettingsModule,
  ],
  controllers: [CompositeController],
  providers: [CompositeService, PrismaService],
})
export class CompositeModule {}
