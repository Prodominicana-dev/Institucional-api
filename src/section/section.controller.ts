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
import { DocumentsService } from 'src/documents/documents.service';

const fs = require('fs');
const path = require('path');

@Controller('api/section')
export class SectionController {
  constructor(
    private readonly sectionService: SectionService,
    private readonly documentsService: DocumentsService,
  ) {}

  /* Crear una seccion */
  @Post()
  async create(@Body() body, @Res() res) {
    try {
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
}
