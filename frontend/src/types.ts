export interface Pedido {
  id: string;
  cliente: string;
  tipo: 'Ajuste' | 'Confecção' | 'Conserto' | 'Reforma' | 'Outro' | string;
  descricao?: string | null;
  material: number;
  maoDeObra: number;
  total: number;
  data: string;
  criadoEm: string;
}

export interface AnaliseTipo {
  tipo: string;
  quantidade: number;
  faturamento: number;
}

export interface AnaliseMes {
  anoMes: string;
  mesAnoLabel: string;
  quantidade: number;
  faturamento: number;
}

export interface AnaliseData {
  porTipo: AnaliseTipo[];
  porMes: AnaliseMes[];
}
