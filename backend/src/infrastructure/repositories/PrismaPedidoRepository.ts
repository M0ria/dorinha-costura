import { IPedidoRepository } from '../../domain/repositories/IPedidoRepository';
import { Pedido } from '../../domain/entities/Pedido';
import { prisma } from '../database/prismaClient';
import { PedidoMapper } from '../mappers/PedidoMapper';

export class PrismaPedidoRepository implements IPedidoRepository {
  public async findAll(): Promise<Pedido[]> {
    const rawPedidos = await prisma.pedido.findMany({
      orderBy: {
        data: 'desc',
      },
    });
    return rawPedidos.map(PedidoMapper.toDomain);
  }

  public async findById(id: string): Promise<Pedido | null> {
    const raw = await prisma.pedido.findUnique({
      where: { id },
    });
    if (!raw) return null;
    return PedidoMapper.toDomain(raw);
  }

  public async create(pedido: Pedido): Promise<Pedido> {
    const dataPersistence = PedidoMapper.toPersistence(pedido);
    const created = await prisma.pedido.create({
      data: dataPersistence,
    });
    return PedidoMapper.toDomain(created);
  }

  public async delete(id: string): Promise<void> {
    await prisma.pedido.delete({
      where: { id },
    });
  }
}
