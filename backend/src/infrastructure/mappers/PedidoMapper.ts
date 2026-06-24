import { Pedido } from '../../domain/entities/Pedido';
import { Pedido as PrismaPedido } from '@prisma/client';

export class PedidoMapper {
  public static toDomain(raw: PrismaPedido): Pedido {
    return Pedido.create({
      id: raw.id,
      cliente: raw.cliente,
      tipo: raw.tipo,
      descricao: raw.descricao,
      material: raw.material,
      maoDeObra: raw.maoDeObra,
      total: raw.total,
      data: raw.data,
      criadoEm: raw.criadoEm,
    });
  }

  public static toPersistence(domain: Pedido) {
    return {
      id: domain.getId(),
      cliente: domain.getCliente(),
      tipo: domain.getTipo(),
      descricao: domain.getDescricao(),
      material: domain.getMaterial(),
      maoDeObra: domain.getMaoDeObra(),
      total: domain.getTotal(),
      data: domain.getData(),
    };
  }

  public static toDTO(domain: Pedido) {
    return {
      id: domain.getId(),
      cliente: domain.getCliente(),
      tipo: domain.getTipo(),
      descricao: domain.getDescricao(),
      material: domain.getMaterial(),
      maoDeObra: domain.getMaoDeObra(),
      total: domain.getTotal(),
      data: domain.getData().toISOString(),
      criadoEm: domain.getCriadoEm() ? domain.getCriadoEm()?.toISOString() : undefined,
    };
  }
}
export default PedidoMapper;
