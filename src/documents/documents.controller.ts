import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  Res,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { DocumentSectionSubsectionDto } from './dto/documents.dto';
import { Documents, Prisma } from '@prisma/client';

const fs = require('fs');
const path = require('path');

@Controller('api/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async getAllDocuments(@Res() res) {
    try {
      const documents = await this.documentsService.getAllDocuments();
      return res.status(200).json({ documents });
    } catch (error) {
      return res.status(404).json({ error });
    }
  }

  @Get('/s')
  async getDocumentsBySectionOrSubsection(
    @Param('id') id: number,
    @Body() body: DocumentSectionSubsectionDto,
    @Res() res,
  ) {
    try {
      const documents =
        await this.documentsService.getDocumentsBySectionOrSubsection(
          body?.sectionId,
          body?.subsectionId,
        );
      return res.status(200).json({ documents });
    } catch (error) {
      return res.status(404).json({ error });
    }
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: DocumentSectionSubsectionDto,
    @Res() res,
  ) {
    try {
      console.log(files.length);
      /* Crear la carpeta del documento */
      const pathFolder = path.join(
        process.cwd(),
        `public/docs/${body.sectionId}${
          body.subsectionId ? `/${body.subsectionId}` : ''
        }`,
      );

      if (!fs.existsSync(pathFolder)) {
        fs.mkdirSync(pathFolder, { recursive: true });
      }

      files.forEach(async (file) => {
        const fileName = file.originalname;
        const size = file.size;
        const data = {
          date: new Date(),
          name: fileName,
          size: size.toString(),
          path: body.subsectionId
            ? `docs/${body.sectionId}/${body.subsectionId}/${fileName}`
            : `docs/${body.sectionId}/${fileName}`,
          sectionId: Number(body.sectionId),
          subsectionId: body.subsectionId ? Number(body.subsectionId) : null,
        };

        await fs.writeFileSync(path.join(pathFolder, fileName), file.buffer);
        await this.documentsService.create(data);
      });

      return res.status(200).json({ message: 'Documentos creados' });
    } catch (error) {
      return res.status(404).json({ error });
    }
  }

  /* Editar un documento o los documentos de una seccion o subseccion */
  @Patch()
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: DocumentSectionSubsectionDto,
    @Res() res,
  ) {
    try {
      /* Crear la carpeta del documento */
      const pathFolder = path.join(
        process.cwd(),
        `public/docs/${body.sectionId}${
          body.subsectionId ? `/${body.subsectionId}` : ''
        }`,
      );

      if (!fs.existsSync(pathFolder)) {
        fs.mkdirSync(pathFolder, { recursive: true });
      }

      files.forEach(async (file) => {
        const fileName = file.originalname;
        const size = file.size;
        const data = {
          date: new Date(),
          name: fileName,
          size: size.toString(),
          path: body.subsectionId
            ? `docs/${body.sectionId}/${body.subsectionId}/${fileName}`
            : `docs/${body.sectionId}/${fileName}`,
          sectionId: Number(body.sectionId),
          subsectionId: body.subsectionId ? Number(body.subsectionId) : null,
        };

        await fs.writeFileSync(path.join(pathFolder, fileName), file.buffer);
        await this.documentsService.create(data);
      });

      return res.status(200).json({ message: 'Documentos creados' });
    } catch (error) {
      return res.status(404).json({ error });
    }
  }
}
