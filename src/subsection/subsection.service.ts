import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Subsection } from '@prisma/client';

@Injectable()
export class SubsectionService {
  constructor(private readonly prismaService: PrismaService) {}

  /* Crear una nueva subsección */
  async create(data: Prisma.SubsectionCreateInput): Promise<Subsection> {
    try {
      return this.prismaService.subsection.create({ data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /* Editar una subsección */
  async update(id: string, data: any): Promise<Subsection> {
    try {
      console.log('Lo va a hacer');
      return this.prismaService.subsection
        .update({
          where: { id },
          data,
        })
        .then((res) => {
          return res;
        });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /* Obtener todas las subsecciones con todos los datos */
  async getAllSubsections(): Promise<Subsection[]> {
    try {
      const subsection = await this.prismaService.subsection.findMany({
        include: { documents: true, section: true },
      });

      const subDocuments = subsection.filter((section) => {
        return (section.documents = section.documents.filter((document) => {
          return document.sectionId !== null && document.subsectionId !== null;
        }));
      });

      return subDocuments;
    } catch (error) {
      throw error;
    }
  }

  /* Obtener una subseccion por ID */
  async getById(id: string): Promise<Subsection> {
    try {
      return this.prismaService.subsection.findUnique({
        where: { id },
        include: { documents: true, section: true },
      });
    } catch (error) {
      throw error;
    }
  }

  /* Activar una subseccion */
  async enable(id: string): Promise<Subsection> {
    try {
      return this.prismaService.subsection.update({
        where: { id },
        data: { status: true },
      });
    } catch (error) {
      throw error;
    }
  }

  /* Desactivar una subseccion */
  async disable(id: string): Promise<Subsection> {
    try {
      return this.prismaService.subsection.update({
        where: { id },
        data: { status: false },
      });
    } catch (error) {
      throw error;
    }
  }

  /* Borrar una subseccion */
  async delete(id: string): Promise<Subsection> {
    try {
      return this.prismaService.subsection.delete({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
