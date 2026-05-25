import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { CompositeModule } from './composite/composite.module';
// import { CompositeController } from './composite/composite.controller';
@Module({
  imports: [CategoriesModule, CompositeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
