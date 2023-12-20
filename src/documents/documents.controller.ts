import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Res,
  UseInterceptors,
  UploadedFiles,
  StreamableFile,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { DocumentSectionSubsectionDto } from './dto/documents.dto';
import { validateUser } from 'src/validation/validation';
import { Response } from 'express';
import mime from 'mime-types';

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
      const id = res.req.headers.authorization;
      const auth0Token = await validateUser(
        'waad|xvWsxdou98HCd9yVNO0mfxkYgkNja8yrT_uriBs7Low',
        'create:transparency',
      );
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
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
          period: body.period,
        };

        await fs.writeFileSync(path.join(pathFolder, fileName), file.buffer);
        await this.documentsService.create(data);
      });

      return res.status(200).json({ message: 'Documentos creados' });
    } catch (error) {
      return res.status(500).json({ error });
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
      const id = res.req.headers.authorization;
      const auth0Token = await validateUser(
        'waad|xvWsxdou98HCd9yVNO0mfxkYgkNja8yrT_uriBs7Low',
        'update:transparency',
      );
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
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
          path: fileName,
          sectionId: Number(body.sectionId),
          subsectionId: body.subsectionId ? Number(body.subsectionId) : null,
          period: body.period,
        };

        await fs.writeFileSync(path.join(pathFolder, fileName), file.buffer);
        await this.documentsService.create(data);
      });

      return res.status(200).json({ message: 'Documentos creados' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /* Borrar un documento */
  @Delete(':id')
  async delete(@Param('id') id: number, @Res() res) {
    try {
      const id = res.req.headers.authorization;
      const auth0Token = await validateUser(
        'waad|xvWsxdou98HCd9yVNO0mfxkYgkNja8yrT_uriBs7Low',
        'update:transparency',
      );
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
      const document = await this.documentsService.getById(id);
      const pathFolder = path.join(process.cwd(), `public/${document.path}`);
      await fs.unlinkSync(pathFolder);
      const documentDeleted = await this.documentsService.delete(id);
      return res.status(200).json({ documentDeleted });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /* Obtener los documentos si tiene subsectionId */
  @Get('/:id/:sid/:document')
  getImage(
    @Param(':id') sectionId: number,
    @Param(':sid') subsectionId: number,
    @Param(':document') document: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    console.log(sectionId, subsectionId, document);
    res.set({ 'Content-Type': 'application/pdf' });
    const documentPath = path.join(
      process.cwd(),
      `public/docs/${sectionId}/${subsectionId}/${document}`,
    );
    const mimeType = mime.lookup(documentPath);
    if (!mimeType) {
      return undefined;
    }
    console.log(mimeType);
    const file = fs.createReadStream(documentPath);
    const streamableFile = new StreamableFile(file);
    return streamableFile;
  }
}
