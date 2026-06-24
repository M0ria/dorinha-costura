import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { z } from 'zod';
import { PedidoService } from '../../application/services/PedidoService';
import { PedidoMapper } from '../../infrastructure/mappers/PedidoMapper';

export class PedidoController {
  public async listAll(req: Request, res: Response): Promise<void> {
    try {
      const pedidoService = container.resolve(PedidoService);
      const domainPedidos = await pedidoService.listarTodos();
      const dtos = domainPedidos.map(PedidoMapper.toDTO);
      res.json(dtos);
    } catch (error: any) {
      console.error('Erro no controller listAll:', error);
      res.status(500).json({ error: error.message || 'Erro ao listar pedidos' });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const bodySchema = z.object({
        cliente: z.string().min(1, 'O nome do cliente é obrigatório.'),
        tipo: z.string(),
        descricao: z.string().optional().nullable(),
        material: z.number().min(0, 'O material não pode ser negativo.'),
        maoDeObra: z.number().min(0, 'A mão de obra não pode ser negativa.'),
        data: z.string().transform((val) => new Date(val)),
      });

      const body = bodySchema.parse(req.body);

      const pedidoService = container.resolve(PedidoService);
      const created = await pedidoService.criarPedido(body);

      res.status(201).json(PedidoMapper.toDTO(created));
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: (error as any).errors });
        return;
      }
      console.error('Erro no controller create:', error);
      res.status(400).json({ error: error.message || 'Erro ao criar o pedido' });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const idSchema = z.string().uuid('ID inválido.');
      const id = idSchema.parse(req.params.id);

      const pedidoService = container.resolve(PedidoService);
      await pedidoService.deletarPedido(id);
      
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: (error as any).errors });
        return;
      }
      console.error('Erro no controller delete:', error);
      res.status(500).json({ error: error.message || 'Erro ao deletar o pedido' });
    }
  }

  public async getAnalise(req: Request, res: Response): Promise<void> {
    try {
      const pedidoService = container.resolve(PedidoService);
      const analise = await pedidoService.gerarAnalise();
      res.json(analise);
    } catch (error: any) {
      console.error('Erro no controller getAnalise:', error);
      res.status(500).json({ error: error.message || 'Erro ao gerar análise' });
    }
  }

  public async exportCsv(req: Request, res: Response): Promise<void> {
    try {
      const pedidoService = container.resolve(PedidoService);
      const { csv, filePath } = await pedidoService.exportarCsv();

      console.log(`[CSV] Arquivo salvo em: ${filePath}`);

      // Envia também como download no navegador
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="pedidos_dorinha.csv"');
      res.send(csv);
    } catch (error: any) {
      console.error('Erro no controller exportCsv:', error);
      res.status(500).json({ error: error.message || 'Erro ao exportar CSV' });
    }
  }

  public async uploadFile(req: Request, res: Response): Promise<Response> {
    try {
      const files = req.files ? Array.prototype.slice.call(req.files) : [];
      const file: Express.Multer.File = files[0];

      const pedidoService = container.resolve(PedidoService);
      const result = await pedidoService.processUpload(file);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Erro no controller uploadFile:', error);
      return res.status(400).json({ error: error.message || 'Erro ao processar arquivo' });
    }
  }
}

export default new PedidoController();
