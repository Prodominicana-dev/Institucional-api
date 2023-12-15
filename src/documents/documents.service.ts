import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Documents } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private readonly prismaService: PrismaService) {}

  /* Crear un nuevo documento para una seccion o subseccion*/
  async create(data: Prisma.DocumentsCreateInput): Promise<Documents> {
    try {
      return this.prismaService.documents.create({ data });
    } catch (error) {
      throw error;
    }
  }

  /* Editar un documento una seccion o subseccion*/
  async update(
    id: number,
    data: Prisma.DocumentsUpdateInput,
  ): Promise<Documents> {
    try {
      return this.prismaService.documents.update({
        where: { id: Number(id) },
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  /* Obtener todos los documentos de una seccion o subseccion*/
  async getAllDocuments(): Promise<Documents[]> {
    try {
      return this.prismaService.documents.findMany({
        include: {
          section: true,
          subsection: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /* Obtener todos los documentos de una misma seccion o subseccion */
  async getDocumentsBySectionOrSubsection(
    sectionId: number,
    subsectionId: number,
  ): Promise<Documents[]> {
    try {
      return this.prismaService.documents.findMany({
        where: {
          OR: [
            {
              sectionId: Number(sectionId),
            },
            {
              subsectionId: Number(subsectionId),
            },
          ],
        },
        include: {
          section: true,
          subsection: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /* Obtener un documento por ID */
  async getById(id: number): Promise<Documents> {
    try {
      return this.prismaService.documents.findUnique({
        where: { id: Number(id) },
        include: {
          section: true,
          subsection: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /* Obtener documento por nombre */

  /* Borrar un documento */
  async delete(id: number): Promise<Documents> {
    try {
      return this.prismaService.documents.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw error;
    }
  }
}
