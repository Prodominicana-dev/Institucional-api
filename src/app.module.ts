import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { SectionModule } from './section/section.module';
import { SubsectionModule } from './subsection/subsection.module';
import { UrlModule } from './url/url.module';
import { DocumentsModule } from './documents/documents.module';
import { NewsModule } from './news/news.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [SectionModule, SubsectionModule, UrlModule, DocumentsModule, NewsModule, FilesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
