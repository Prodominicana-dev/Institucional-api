import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Section } from '@prisma/client';
import { DocumentsService } from 'src/documents/documents.service';

@Injectable()
export class SectionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly documentsService: DocumentsService,
  ) {}

  /* Crear una nueva sección */
  async create(data: Prisma.SectionCreateInput): Promise<Section> {
    try {
      return this.prismaService.section.create({ data });
    } catch (error) {
      throw error;
    }
  }

  /* Editar una sección */
  async update(id: number, data: Prisma.SectionUpdateInput): Promise<Section> {
    try {
      return this.prismaService.section.update({
        where: { id: Number(id) },
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  /* Obtener todas las secciones con todos los datos */
  async getAllSections(): Promise<any[]> {
    try {
      const sections = await this.prismaService.section.findMany({
        where: { status: true },
        include: { documents: true, subsection: true },
      });
      const secDocuments = sections.filter((section) => {
        return (section.documents = section.documents.filter((document) => {
          return document.sectionId !== null && document.subsectionId === null;
        }));
      });
      console.log(secDocuments);
      return secDocuments;
    } catch (error) {
      throw error;
    }
  }

  /* Obtener una seccion por ID */
  async getById(id: number): Promise<Section> {
    try {
      return this.prismaService.section.findUnique({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw error;
    }
  }
}
