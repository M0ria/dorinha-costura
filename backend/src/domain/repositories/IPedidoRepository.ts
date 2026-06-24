import { Pedido } from '../entities/Pedido';

export interface IPedidoRepository {
  findAll(): Promise<Pedido[]>;
  create(pedido: Pedido): Promise<Pedido>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Pedido | null>;
}
