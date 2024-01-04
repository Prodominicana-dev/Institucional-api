import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Res,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { validateUser } from 'src/validation/validation';
const CryptoJS = require('crypto-js');
const fs = require('fs');
const path = require('path');

@Controller('api/section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  /* Crear una seccion */
  @Post()
  async create(@Body() body, @Res() res) {
    try {
      const id = res.req.headers.authorization;
      const idBytes = CryptoJS.AES.decrypt(id, process.env.CRYPTO_KEY);
      const idDecrypted = idBytes.toString(CryptoJS.enc.Utf8);
      console.log(idDecrypted);
      const auth0Token = await validateUser(idDecrypted, 'create:transparency');
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
      const section = await this.sectionService.create(body);
      return res.status(201).json({ section });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /* Editar una seccion */
  @Patch(':id')
  async update(@Param('id') id: number, @Body() body, @Res() res) {
    try {
      const id = res.req.headers.authorization;
      const auth0Token = await validateUser(
        'waad|xvWsxdou98HCd9yVNO0mfxkYgkNja8yrT_uriBs7Low',
        'update:transparency',
      );
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
      const section = await this.sectionService.update(id, body);
      return res.status(200).json({ section });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /* Obtener una seccion en especifico */
  @Get(':id')
  async getById(@Param('id') id: number, @Res() res) {
    try {
      const section = await this.sectionService.getById(id);
      return res.status(200).json({ section });
    } catch (error) {
      return res.status(404).json({ error });
    }
  }

  /* Obtener todas las secciones */
  @Get()
  async getAllSections(@Res() res) {
    try {
      const sections = await this.sectionService.getAllSections();
      return res.status(200).json({ sections });
    } catch (error) {
      return res.status(404).json({ error });
    }
  }
}
