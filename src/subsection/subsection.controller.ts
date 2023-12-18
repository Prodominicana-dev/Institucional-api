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

@Controller('api/subsection')
export class SubsectionController {
  constructor(private readonly subsectionService: SubsectionService) {}

  /* Crear una subseccion */
  @Post()
  async create(@Body() body, @Res() res) {
    try {
      const id = res.req.headers.authorization;
      const auth0Token = await validateUser(
        'waad|xvWsxdou98HCd9yVNO0mfxkYgkNja8yrT_uriBs7Low',
        'create:transparency',
      );
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
      const id = res.req.headers.authorization;
      const auth0Token = await validateUser(
        'waad|xvWsxdou98HCd9yVNO0mfxkYgkNja8yrT_uriBs7Low',
        'update:transparency',
      );
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
      const subsection = await this.subsectionService.update(id, body);
      return res.status(200).json({ subsection });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /* Obtener una subseccion en especifico */
  @Get(':id')
  async getById(@Param('id') id: number, @Res() res) {
    try {
      const id = res.req.headers.authorization;
      const auth0Token = await validateUser(
        'waad|xvWsxdou98HCd9yVNO0mfxkYgkNja8yrT_uriBs7Low',
        'read:transparency',
      );
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
      const id = res.req.headers.authorization;
      const auth0Token = await validateUser(
        'waad|xvWsxdou98HCd9yVNO0mfxkYgkNja8yrT_uriBs7Low',
        'read:transparency',
      );
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
      const subsections = await this.subsectionService.getAllSubsections();
      return res.status(200).json({ subsections });
    } catch (error) {
      return res.status(404).json({ error });
    }
  }
}
