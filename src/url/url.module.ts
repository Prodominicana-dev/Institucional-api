import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [UrlService, PrismaService],
  controllers: [UrlController],
  exports: [UrlService],
})
export class UrlModule {}
