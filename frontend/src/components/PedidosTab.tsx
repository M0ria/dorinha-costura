"use client";

import React from 'react';
import type { Pedido } from '../types';
import MetricsCards from './MetricsCards';

interface PedidosTabProps {
  pedidos: Pedido[];
  onDelete: (id: string) => void;
  loading: boolean;
}

export const PedidosTab: React.FC<PedidosTabProps> = ({ pedidos, onDelete, loading }) => {
  const getBadgeClass = (tipo: string) => {
    switch (tipo) {
      case 'Ajuste': return 'badge-ajuste';
      case 'Confecção': return 'badge-confeccao';
      case 'Conserto': return 'badge-conserto';
      case 'Reforma': return 'badge-reforma';
      default: return 'badge-outro';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div>
      <MetricsCards pedidos={pedidos} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#70625B', fontWeight: '500' }}>
          Carregando pedidos...
        </div>
      ) : pedidos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🧵</div>
          <h3>Nenhum pedido cadastrado</h3>
          <p>Registre novos pedidos na aba "Novo pedido" para visualizá-los aqui.</p>
        </div>
      ) : (
        <div className="orders-list">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="order-item">
              <div className="order-main-info">
                <span className={`order-badge ${getBadgeClass(pedido.tipo)}`}>
                  {pedido.tipo}
                </span>
                <div className="order-details">
                  <div className="order-client-name">{pedido.cliente}</div>
                  {pedido.tipo === 'Outro' && pedido.descricao && (
                    <div className="order-description">{pedido.descricao}</div>
                  )}
                  <div className="order-date">Data: {formatDate(pedido.data)}</div>
                </div>
              </div>

              <div className="order-values">
                <div className="order-value-item">
                  <span className="value-label">Material</span>
                  <span className="value-amount">{formatCurrency(pedido.material)}</span>
                </div>
                <div className="order-value-item">
                  <span className="value-label">Mão de obra</span>
                  <span className="value-amount">{formatCurrency(pedido.maoDeObra)}</span>
                </div>
                <div className="order-value-item">
                  <span className="value-label">Total</span>
                  <span className="value-amount total">{formatCurrency(pedido.total)}</span>
                </div>

                <button
                  type="button"
                  className="order-delete-btn"
                  onClick={() => {
                    if (window.confirm(`Tem certeza de que deseja remover o pedido de "${pedido.cliente}"?`)) {
                      onDelete(pedido.id);
                    }
                  }}
                  title="Excluir pedido"
                >
                  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosTab;
