import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, Url } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UrlService {
  constructor(private readonly prismaService: PrismaService) {}

  /* Crear URL en base a la seccion o subseccion */
  async create(secId: Number, subId: Number, url: String): Promise<Url> {
    try {
      const data: any = {
        section: secId ?? Number(secId),
        subsection: subId ?? Number(subId),
        url,
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
}
