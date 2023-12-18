import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UrlModule } from 'src/url/url.module';
import { DocumentsModule } from 'src/documents/documents.module';
import { SubsectionModule } from 'src/subsection/subsection.module';

@Module({
  providers: [SectionService, PrismaService],
  controllers: [SectionController],
  exports: [SectionService],
  imports: [UrlModule, DocumentsModule],
})
export class SectionModule {}
