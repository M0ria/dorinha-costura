import { inject, injectable, registry } from 'tsyringe';
import { IPedidoRepository } from '../../domain/repositories/IPedidoRepository';
import { Pedido } from '../../domain/entities/Pedido';
import { PrismaPedidoRepository } from '../../infrastructure/repositories/PrismaPedidoRepository';
import { RepositoryToken } from '../../infrastructure/di/RepositoryToken';

export interface CreatePedidoDto {
  cliente: string;
  tipo: string;
  descricao?: string | null;
  material: number;
  maoDeObra: number;
  data: Date;
}

@injectable()
@registry([
  { token: RepositoryToken.PEDIDO_REPOSITORY, useClass: PrismaPedidoRepository },
])
export class PedidoService {
  constructor(
    @inject(RepositoryToken.PEDIDO_REPOSITORY)
    private readonly repository: IPedidoRepository,
  ) {}

  public async listarTodos(): Promise<Pedido[]> {
    return this.repository.findAll();
  }

  public async criarPedido(data: CreatePedidoDto): Promise<Pedido> {
    if (!data.cliente || data.cliente.trim() === '') {
      throw new Error('O nome do cliente é obrigatório.');
    }

    const tiposValidos = ['Ajuste', 'Confecção', 'Conserto', 'Reforma', 'Outro'];
    if (!tiposValidos.includes(data.tipo)) {
      throw new Error(`Tipo de serviço inválido: ${data.tipo}`);
    }

    let descricaoFinal = data.descricao || null;
    if (data.tipo === 'Outro') {
      if (!descricaoFinal || descricaoFinal.trim() === '') {
        throw new Error('A descrição é obrigatória para o tipo de serviço "Outro".');
      }
    } else {
      descricaoFinal = null;
    }

    if (data.material < 0 || data.maoDeObra < 0) {
      throw new Error('Os custos de material e mão de obra não podem ser negativos.');
    }

    const total = data.material + data.maoDeObra;

    const newPedido = Pedido.create({
      cliente: data.cliente.trim(),
      tipo: data.tipo,
      descricao: descricaoFinal,
      material: data.material,
      maoDeObra: data.maoDeObra,
      total: total,
      data: data.data,
    });

    const savedPedido = await this.repository.create(newPedido);
    return savedPedido;
  }

  public async deletarPedido(id: string): Promise<void> {
    const pedido = await this.repository.findById(id);
    if (!pedido) {
      throw new Error('Pedido não encontrado para exclusão.');
    }
    await this.repository.delete(id);
  }

  public async gerarAnalise() {
    const pedidos = await this.repository.findAll();

    const tiposValidos = ['Ajuste', 'Confecção', 'Conserto', 'Reforma', 'Outro'];
    const porTipoMap = new Map<string, { tipo: string; quantidade: number; faturamento: number }>();
    
    tiposValidos.forEach(tipo => {
      porTipoMap.set(tipo, { tipo, quantidade: 0, faturamento: 0 });
    });

    pedidos.forEach(pedido => {
      const tipo = pedido.getTipo();
      const stats = porTipoMap.get(tipo) || { tipo, quantidade: 0, faturamento: 0 };
      stats.quantidade += 1;
      stats.faturamento += pedido.getTotal();
      porTipoMap.set(tipo, stats);
    });

    const porTipo = Array.from(porTipoMap.values());

    const porMesMap = new Map<string, { anoMes: string; mesAnoLabel: string; quantidade: number; faturamento: number }>();
    const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    pedidos.forEach(pedido => {
      const date = new Date(pedido.getData());
      const ano = date.getUTCFullYear();
      const mesIndex = date.getUTCMonth(); // 0-11
      const anoMes = `${ano}-${String(mesIndex + 1).padStart(2, '0')}`;
      const mesAnoLabel = `${mesesNomes[mesIndex]}/${String(ano).substring(2)}`;

      const stats = porMesMap.get(anoMes) || { anoMes, mesAnoLabel, quantidade: 0, faturamento: 0 };
      stats.quantidade += 1;
      stats.faturamento += pedido.getTotal();
      porMesMap.set(anoMes, stats);
    });

    const porMes = Array.from(porMesMap.values()).sort((a, b) => a.anoMes.localeCompare(b.anoMes));

    return {
      porTipo,
      porMes
    };
  }
}
