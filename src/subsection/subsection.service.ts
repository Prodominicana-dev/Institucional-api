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
      throw error;
    }
  }

  /* Editar una subsección */
  async update(
    id: number,
    data: Prisma.SubsectionUpdateInput,
  ): Promise<Subsection> {
    try {
      return this.prismaService.subsection.update({
        where: { id: Number(id) },
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  /* Obtener todas las subsecciones con todos los datos */
  async getAllSubsections(): Promise<Subsection[]> {
    try {
      const subsection = await this.prismaService.subsection.findMany({
        where: { status: true },
        include: { documents: true },
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
  async getById(id: number): Promise<Subsection> {
    try {
      return this.prismaService.subsection.findUnique({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw error;
    }
  }
}
