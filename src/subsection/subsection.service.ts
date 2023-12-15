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
