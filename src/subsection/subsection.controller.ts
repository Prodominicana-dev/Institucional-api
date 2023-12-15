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

@Controller('api/subsection')
export class SubsectionController {
  constructor(private readonly subsectionService: SubsectionService) {}

  /* Crear una subseccion */
  @Post()
  async create(@Body() body, @Res() res) {
    try {
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
      const subsection = await this.subsectionService.getById(id);
      return res.status(200).json({ subsection });
    } catch (error) {
      return res.status(404).json({ error });
    }
  }
}
