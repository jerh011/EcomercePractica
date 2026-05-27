import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { CompositeModule } from './composite/composite.module';
import { BrandsModule } from './brands/brands.module';
@Module({
  imports: [CategoriesModule, CompositeModule, BrandsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
