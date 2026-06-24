"use client";

import React from 'react';
import type { Pedido } from '../types';

interface MetricsCardsProps {
  pedidos: Pedido[];
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ pedidos }) => {
  const totalPedidos = pedidos.length;
  const faturamentoTotal = pedidos.reduce((acc, curr) => acc + curr.total, 0);
  const ticketMedio = totalPedidos > 0 ? faturamentoTotal / totalPedidos : 0;

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-title">Total de Pedidos</div>
        <div className="metric-value">{totalPedidos}</div>
      </div>
      <div className="metric-card">
        <div className="metric-title">Faturamento Total</div>
        <div className="metric-value">{formatCurrency(faturamentoTotal)}</div>
      </div>
      <div className="metric-card">
        <div className="metric-title">Ticket Médio</div>
        <div className="metric-value">{formatCurrency(ticketMedio)}</div>
      </div>
    </div>
  );
};

export default MetricsCards;
