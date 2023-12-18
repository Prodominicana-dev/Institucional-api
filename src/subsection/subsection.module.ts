import { Module } from '@nestjs/common';
import { SubsectionService } from './subsection.service';
import { SubsectionController } from './subsection.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UrlModule } from 'src/url/url.module';

@Module({
  providers: [SubsectionService, PrismaService],
  controllers: [SubsectionController],
  exports: [SubsectionService],
})
export class SubsectionModule {}
