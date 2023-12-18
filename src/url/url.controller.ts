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
} from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlDto } from './dto/url.dto';
import { validateUser } from 'src/validation/validation';

@Controller('api/url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  /* Crear URL */
  @Post()
  async create(@Body() body: UrlDto, @Res() res) {
    try {
      const id = res.req.headers.authorization;
      const auth0Token = await validateUser(
        'waad|xvWsxdou98HCd9yVNO0mfxkYgkNja8yrT_uriBs7Low',
        'create:transparency',
      );
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
      const url = await this.urlService.create(body);
      return res.status(201).json({ url });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /* Editar URL */
  @Patch()
  async update(@Body() body: UrlDto, @Res() res) {
    try {
      const id = res.req.headers.authorization;
      const auth0Token = await validateUser(
        'waad|xvWsxdou98HCd9yVNO0mfxkYgkNja8yrT_uriBs7Low',
        'update:transparency',
      );
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
      const _url = await this.urlService.getBySectionOrSubsection(
        body.sectionId,
        body.subsectionId,
      );
      const url = await this.urlService.update(_url.id, body);
      return res.status(200).json({ url });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /* Eliminar URL */
  @Delete(':id')
  async delete(@Param('id') id: number, @Res() res) {
    try {
      const id = res.req.headers.authorization;
      const auth0Token = await validateUser(
        'waad|xvWsxdou98HCd9yVNO0mfxkYgkNja8yrT_uriBs7Low',
        'update:transparency',
      );
      if (!auth0Token) return res.status(401).json({ error: 'Unauthorized' });
      const url = await this.urlService.delete(id);
      return res.status(200).json({ url });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}
