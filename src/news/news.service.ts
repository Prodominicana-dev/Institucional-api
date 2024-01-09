import { Injectable } from '@nestjs/common';
import { News, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  /* Crear noticia */
  async create(data: Prisma.NewsCreateInput): Promise<News> {
    try {
      return this.prisma.news.create({
        data,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  /* Editar noticia */
  async update(id: string, data: Prisma.NewsUpdateInput): Promise<News> {
    try {
      return this.prisma.news.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  /* Eliminar noticia */
  async delete(id: string): Promise<News> {
    try {
      return this.prisma.news.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  /* Buscar noticia por id */
  async findOne(id: string): Promise<News | null> {
    try {
      return this.prisma.news.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  /* Todas las noticias */
  async findAll(): Promise<News[]> {
    try {
      return this.prisma.news.findMany({
        orderBy: {
          created_At: 'desc',
        },
        where: {
          status: true,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
