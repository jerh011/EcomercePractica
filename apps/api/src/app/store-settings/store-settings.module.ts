import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StoreSettingsController } from './store-settings.controller';
import { StoreSettingsService } from './store-settings.service';

@Module({
  controllers: [StoreSettingsController],
  providers: [StoreSettingsService, PrismaService],
  exports: [StoreSettingsService],
})
export class StoreSettingsModule {}
