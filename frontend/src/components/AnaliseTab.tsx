"use client";

import React from 'react';
import type { Pedido, AnaliseData } from '../types';
import MetricsCards from './MetricsCards';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface AnaliseTabProps {
  pedidos: Pedido[];
  analiseData: AnaliseData | null;
  loading: boolean;
}

const PALETTE: { [key: string]: string } = {
  'Ajuste': '#1D9E75',
  'Confecção': '#D85A30',
  'Conserto': '#BA7517',
  'Reforma': '#534AB7',
  'Outro': '#888780'
};

export const AnaliseTab: React.FC<AnaliseTabProps> = ({ pedidos, analiseData, loading }) => {
  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatTooltipCurrency = (value: any) => {
    if (typeof value === 'number') {
      return [formatCurrency(value), 'Faturamento'];
    }
    return [value, 'Faturamento'];
  };

  if (loading || !analiseData) {
    return (
      <div>
        <MetricsCards pedidos={pedidos} />
        <div style={{ textAlign: 'center', padding: '40px', color: '#70625B', fontWeight: '500' }}>
          Carregando dados da análise...
        </div>
      </div>
    );
  }

  return (
    <div>
      <MetricsCards pedidos={pedidos} />

      <div className="charts-grid">
        {/* Gráfico 1: Frequência por Tipo */}
        <div className="chart-card">
          <h4>Frequência de Serviços por Tipo</h4>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analiseData.porTipo}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6DDD4" />
                <XAxis dataKey="tipo" tick={{ fill: '#70625B', fontSize: 12 }} axisLine={{ stroke: '#E6DDD4' }} />
                <YAxis tick={{ fill: '#70625B', fontSize: 12 }} axisLine={{ stroke: '#E6DDD4' }} />
                <Tooltip
                  cursor={{ fill: 'rgba(216, 90, 48, 0.05)' }}
                  contentStyle={{ backgroundColor: '#FAF6F0', borderColor: '#E6DDD4', borderRadius: '8px' }}
                />
                <Bar dataKey="quantidade" radius={[4, 4, 0, 0]}>
                  {analiseData.porTipo.map((entry, index) => (
                    <Cell key={`cell-freq-${index}`} fill={PALETTE[entry.tipo] || '#888780'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Faturamento por Tipo */}
        <div className="chart-card">
          <h4>Faturamento por Tipo de Serviço</h4>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analiseData.porTipo}
                margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6DDD4" />
                <XAxis dataKey="tipo" tick={{ fill: '#70625B', fontSize: 12 }} axisLine={{ stroke: '#E6DDD4' }} />
                <YAxis tick={{ fill: '#70625B', fontSize: 12 }} axisLine={{ stroke: '#E6DDD4' }} />
                <Tooltip
                  formatter={formatTooltipCurrency}
                  cursor={{ fill: 'rgba(216, 90, 48, 0.05)' }}
                  contentStyle={{ backgroundColor: '#FAF6F0', borderColor: '#E6DDD4', borderRadius: '8px' }}
                />
                <Bar dataKey="faturamento" radius={[4, 4, 0, 0]}>
                  {analiseData.porTipo.map((entry, index) => (
                    <Cell key={`cell-rev-${index}`} fill={PALETTE[entry.tipo] || '#888780'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 3: Evolução de pedidos por mês */}
        <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
          <h4>Evolução de Pedidos por Mês</h4>
          <div className="chart-wrapper" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analiseData.porMes}
                margin={{ top: 15, right: 20, left: -20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E6DDD4" />
                <XAxis dataKey="mesAnoLabel" tick={{ fill: '#70625B', fontSize: 12 }} axisLine={{ stroke: '#E6DDD4' }} />
                <YAxis tick={{ fill: '#70625B', fontSize: 12 }} axisLine={{ stroke: '#E6DDD4' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FAF6F0', borderColor: '#E6DDD4', borderRadius: '8px' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="quantidade"
                  name="Quantidade de Pedidos"
                  stroke="#D85A30"
                  activeDot={{ r: 8 }}
                  strokeWidth={3}
                  dot={{ r: 5, stroke: '#D85A30', strokeWidth: 2, fill: '#FFF' }}
                />
                <Line
                  type="monotone"
                  dataKey="faturamento"
                  name="Faturamento Mensal (R$)"
                  stroke="#534AB7"
                  strokeWidth={2}
                  dot={{ r: 4, stroke: '#534AB7', strokeWidth: 1, fill: '#FFF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnaliseTab;
