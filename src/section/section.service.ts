import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Section } from '@prisma/client';
import { DocumentsService } from 'src/documents/documents.service';
const fs = require('fs');
const path = require('path');

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
      console.log(error);
      throw error;
    }
  }

  /* Editar una sección */
  async update(id: string, data: Prisma.SectionUpdateInput): Promise<Section> {
    try {
      return this.prismaService.section.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /* Obtener todas las secciones con todos los datos */
  async getAllSections(): Promise<any[]> {
    try {
      const sections = await this.prismaService.section.findMany({
        where: { status: true },
        orderBy: [{ priority: 'asc' }, { id: 'asc' }],
        include: { documents: true, subsection: true },
      });
      const secDocuments = sections.filter((section) => {
        return (section.documents = section.documents.filter((document) => {
          return document.sectionId !== null && document.subsectionId === null;
        }));
      });
      return secDocuments;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /* Obtener una seccion por ID */
  async getById(id: string): Promise<Section> {
    try {
      return this.prismaService.section.findUnique({
        where: { id },
        include: { documents: true, subsection: true },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /* Obtener todas las secciones, incluyendo las que estan deshabilitadas */
  async getAllSectionsAdmin(): Promise<Section[]> {
    try {
      return this.prismaService.section.findMany({
        orderBy: [{ status: 'asc' }, { priority: 'asc' }, { id: 'asc' }],
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /* Activar una seccion */
  async enable(id: string): Promise<Section> {
    try {
      return this.prismaService.section.update({
        where: { id },
        data: { status: true },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /* Desactivar una seccion */
  async disable(id: string): Promise<Section> {
    try {
      return this.prismaService.section.update({
        where: { id },
        data: { status: false },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /* Eliminar una seccion */
  async deleteS(id: string): Promise<Section> {
    try {
      const section: any = await this.getById(id);
      const documents = section.documents;
      documents.forEach(async (document) => {
        const imagePath = path.join(process.cwd(), `public/${document.path}`);
        fs.unlinkSync(imagePath);
        await this.prismaService.documents.delete({
          where: { id: document.id },
        });
      });
      const subsections = section.subsection;
      subsections.forEach(async (subsection) => {
        const sub = await this.prismaService.subsection.findUnique({
          where: { id: subsection.id },
          include: { documents: true },
        });
        const documents = sub.documents;
        documents.forEach(async (document) => {
          const imagePath = path.join(process.cwd(), `public/${document.path}`);
          fs.unlinkSync(imagePath);
          await this.prismaService.documents.delete({
            where: { id: document.id },
          });
        });
        await this.prismaService.subsection.delete({
          where: { id: subsection.id },
        });
      });
      return this.prismaService.section.delete({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
