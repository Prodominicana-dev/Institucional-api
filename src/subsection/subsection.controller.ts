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
import { SubsectionService } from './subsection.service';
import { validateUser } from 'src/validation/validation';
import { rimraf } from 'rimraf';
const CryptoJS = require('crypto-js');
const path = require('path');
const fs = require('fs');

@Controller('api/subsection')
export class SubsectionController {
  constructor(private readonly subsectionService: SubsectionService) {}

  /* Crear una subseccion */
  @Post()
  async create(@Body() body, @Res() res) {
    try {
      const _id = res.req.headers.authorization;
      const idBytes = CryptoJS.AES.decrypt(_id, process.env.CRYPTO_KEY);
      const idDecrypted = idBytes.toString(CryptoJS.enc.Utf8);
      const auth0Token = await validateUser(idDecrypted, 'create:transparency');
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
      const subsection = await this.subsectionService.create(body);
      return res.status(201).json({ subsection });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /* Editar una subseccion */
  @Patch(':id')
  async update(@Param('id') id: number, @Body() body, @Res() res) {
    try {
      const _id = res.req.headers.authorization;
      console.log(id);
      const idBytes = CryptoJS.AES.decrypt(_id, process.env.CRYPTO_KEY);
      const idDecrypted = idBytes.toString(CryptoJS.enc.Utf8);
      console.log(idDecrypted);
      const auth0Token = await validateUser(idDecrypted, 'update:transparency');
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
      console.log('body', body);
      const subsection = await this.subsectionService.update(id, body);
      return res.status(200).json({ subsection });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /* Activar una subseccion */
  @Patch('adm/activate/:id')
  async enable(@Param('id') id: number, @Res() res) {
    try {
      const _id = res.req.headers.authorization;
      console.log(id);
      const idBytes = CryptoJS.AES.decrypt(_id, process.env.CRYPTO_KEY);
      const idDecrypted = idBytes.toString(CryptoJS.enc.Utf8);
      console.log(idDecrypted);
      const auth0Token = await validateUser(idDecrypted, 'update:transparency');
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
      const subsection = await this.subsectionService.enable(id);
      return res.status(200).json({ subsection });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /* Desactivar una subseccion */
  @Patch('adm/deactivate/:id')
  async disable(@Param('id') id: number, @Res() res) {
    try {
      const _id = res.req.headers.authorization;
      console.log(id);
      const idBytes = CryptoJS.AES.decrypt(_id, process.env.CRYPTO_KEY);
      const idDecrypted = idBytes.toString(CryptoJS.enc.Utf8);
      console.log(idDecrypted);
      const auth0Token = await validateUser(idDecrypted, 'update:transparency');
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
      const subsection = await this.subsectionService.disable(id);
      return res.status(200).json({ subsection });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /* Obtener una subseccion en especifico */
  @Get(':id')
  async getById(@Param('id') id: number, @Res() res) {
    try {
      const _id = res.req.headers.authorization;
      console.log(id);
      const idBytes = CryptoJS.AES.decrypt(_id, process.env.CRYPTO_KEY);
      const idDecrypted = idBytes.toString(CryptoJS.enc.Utf8);
      console.log(idDecrypted);
      const auth0Token = await validateUser(idDecrypted, 'read:transparency');
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
      const subsection = await this.subsectionService.getById(id);
      return res.status(200).json({ subsection });
    } catch (error) {
      return res.status(404).json({ error });
    }
  }

  /* Obtener todas las subsecciones */
  @Get()
  async getAllSubsections(@Res() res) {
    try {
      const subsections = await this.subsectionService.getAllSubsections();
      return res.status(200).json({ subsections });
    } catch (error) {
      return res.status(404).json({ error });
    }
  }

  /* Borrar sección y todos los documentos que tenga de la carpeta */
  @Delete(':id')
  async delete(@Param('id') id: number, @Res() res) {
    const _id = res.req.headers.authorization;
    const idBytes = CryptoJS.AES.decrypt(_id, process.env.CRYPTO_KEY);
    const idDecrypted = idBytes.toString(CryptoJS.enc.Utf8);
    console.log(idDecrypted);
    const auth0Token = await validateUser(idDecrypted, 'delete:transparency');
    if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
    const subsection = await this.subsectionService.getById(id);
    if (!subsection) throw new Error('Subsection not found');
    const docsPath = path.join(
      process.cwd(),
      `public/docs/${subsection.sectionId}/${subsection.id}`,
    );
    if (!fs.existsSync(docsPath)) rimraf.sync(docsPath);
    return this.subsectionService.delete(id);
  }
}
