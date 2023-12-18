import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, Url } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UrlDto } from './dto/url.dto';

@Injectable()
export class UrlService {
  constructor(private readonly prismaService: PrismaService) {}

  /* Crear URL en base a la seccion o subseccion */
  async create(body: UrlDto): Promise<Url> {
    try {
      const data: any = {
        sectionId: Number(body.sectionId),
        subsectionId: body.subsectionId ? Number(body.subsectionId) : null,
        url: body.url,
      };
      return this.prismaService.url.create({ data });
    } catch (error) {
      throw error;
    }
  }

  /* Editar URL */
  async update(id: number, data: Prisma.UrlUpdateInput): Promise<Url> {
    try {
      return this.prismaService.url.update({
        where: { id: Number(id) },
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  /* Obtener URL por ID */
  async getById(id: number): Promise<Url> {
    try {
      return this.prismaService.url.findUnique({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw error;
    }
  }

  /* Obtener URL por sectionID y subsection */
  async getBySectionOrSubsection(
    sectionId: number,
    subsectionId: number,
  ): Promise<Url> {
    try {
      return this.prismaService.url.findFirst({
        where: {
          sectionId: Number(sectionId),
          subsectionId: Number(subsectionId),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /* Eliminar URL */
  async delete(id: number): Promise<Url> {
    try {
      return this.prismaService.url.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw error;
    }
  }
}
