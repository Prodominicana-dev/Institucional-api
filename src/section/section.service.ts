import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Section } from '@prisma/client';
import { DocumentsService } from 'src/documents/documents.service';
import { UrlService } from 'src/url/url.service';

@Injectable()
export class SectionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly documentsService: DocumentsService,
    private readonly urlService: UrlService,
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
        include: { documents: true, url: true, subsection: true },
      });
      /* Guardar en URL solo la URL que tenga sectionId y no tenga subsectionId */
      const secUrl = sections.filter((section) => {
        return (section.url = section.url.filter((url) => {
          return url.sectionId !== null && url.subsectionId === null;
        }));
      });
      const secDocuments = secUrl.filter((section) => {
        return (section.documents = section.documents.filter((document) => {
          return document.sectionId !== null && document.subsectionId === null;
        }));
      });

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
