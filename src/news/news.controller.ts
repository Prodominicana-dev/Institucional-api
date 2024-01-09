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
import { NewsService } from './news.service';
import { validateUser } from 'src/validation/validation';
import { NewsDto } from './dto/news.dto';
import { Response } from 'express';

const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

@Controller('/api/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  /* Crear una noticia */
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async createNews(@UploadedFiles() files, @Body() body: NewsDto, @Res() res) {
    try {
      const id = res.req.headers.authorization;
      const auth0Token = await validateUser(
        'waad|xvWsxdou98HCd9yVNO0mfxkYgkNja8yrT_uriBs7Low',
        'create:news',
      );
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
      const news = await this.newsService.create(body);
      /* Crear ruta de las noticias */
      const pathFolder = path.join(process.cwd(), `/public/news/${news.id}`);
      if (!fs.existsSync(pathFolder)) {
        fs.mkdirSync(pathFolder, { recursive: true });
      }
      /* Guardar archivos */
      await files.forEach(async (file) => {
        const fileName = file.originalname;
        await fs.writeFileSync(path.join(pathFolder, fileName), file.buffer);
        news.image = fileName;
        await this.newsService.update(news.id, news);
      });
      return res.status(201).json({ news });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /* Editar una noticia */
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files'))
  async updateNews(
    @Param('id') id: number,
    @UploadedFiles() files,
    @Body() body: NewsDto,
    @Res() res,
  ) {
    try {
      const id = res.req.headers.authorization;
      const auth0Token = await validateUser(
        'waad|xvWsxdou98HCd9yVNO0mfxkYgkNja8yrT_uriBs7Low',
        'update:news',
      );
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
      const news = await this.newsService.update(id, body);
      if (files.length === 0) {
        await this.newsService.update(id, body);
        return res.status(200).json({ news });
      }
      /* Crear ruta de las noticias */
      const pathFolder = path.join(process.cwd(), `/public/news/${id}`);
      if (!fs.existsSync(pathFolder)) {
        fs.mkdirSync(pathFolder, { recursive: true });
      }
      /* Guardar archivos */
      await files.forEach(async (file) => {
        const fileName = file.originalname;
        await fs.writeFileSync(path.join(pathFolder, fileName), file.buffer);
        news.image = `public/news/${id}/${fileName}`;
        await this.newsService.update(id, news);
      });
      return res.status(200).json({ news });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /* Obtener todos las noticias */
  @Get()
  async getAllNews(@Res() res) {
    try {
      const news = await this.newsService.findAll();
      return res.status(200).json({ news });
    } catch (error) {
      return res.status(404).json({ error });
    }
  }

  /* Obtener una noticia por id */
  @Get(':id')
  async getOneNews(@Param('id') id: string, @Res() res) {
    try {
      const news = await this.newsService.findOne(id);
      return res.status(200).json({ news });
    } catch (error) {
      return res.status(404).json({ error });
    }
  }
}
