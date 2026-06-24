"use client";

import React, { useState } from 'react';

interface NovoPedidoTabProps {
  onSuccess: (message: string) => void;
  backendUrl: string;
}

export const NovoPedidoTab: React.FC<NovoPedidoTabProps> = ({ onSuccess, backendUrl }) => {
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [cliente, setCliente] = useState('');
  const [tipo, setTipo] = useState('Ajuste');
  const [descricao, setDescricao] = useState('');
  const [material, setMaterial] = useState('');
  const [maoDeObra, setMaoDeObra] = useState('');
  const [data, setData] = useState(getTodayString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente.trim() || !tipo || !data) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (tipo === 'Outro' && !descricao.trim()) {
      setError('Por favor, forneça uma descrição para o serviço do tipo "Outro".');
      return;
    }

    const materialVal = parseFloat(material) || 0;
    const maoDeObraVal = parseFloat(maoDeObra) || 0;

    setLoading(true);
    setError(null);

    try {
      const selectedDate = new Date(`${data}T12:00:00`);

      const response = await fetch(`${backendUrl}/api/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente,
          tipo,
          descricao: tipo === 'Outro' ? descricao : null,
          material: materialVal,
          maoDeObra: maoDeObraVal,
          data: selectedDate.toISOString(),
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Falha ao salvar o pedido.');
      }

      setCliente('');
      setTipo('Ajuste');
      setDescricao('');
      setMaterial('');
      setMaoDeObra('');
      setData(getTodayString());
      
      onSuccess('Pedido registrado com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao salvar o pedido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ color: '#D85A30', backgroundColor: '#FAECE7', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: '500' }}>
            {error}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="cliente">Nome do cliente *</label>
          <input
            id="cliente"
            type="text"
            className="form-input"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Ex: Maria de Souza"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipo">Tipo de serviço *</label>
          <select
            id="tipo"
            className="form-select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            disabled={loading}
          >
            <option value="Ajuste">Ajuste</option>
            <option value="Confecção">Confecção</option>
            <option value="Conserto">Conserto</option>
            <option value="Reforma">Reforma</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        {tipo === 'Outro' && (
          <div className="form-group">
            <label htmlFor="descricao">Descrição do serviço *</label>
            <textarea
              id="descricao"
              className="form-textarea"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva detalhadamente o serviço"
              required
              rows={3}
              disabled={loading}
            />
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="material">Custo do material (R$)</label>
            <input
              id="material"
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="0,00"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="maoDeObra">Mão de obra (R$)</label>
            <input
              id="maoDeObra"
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              value={maoDeObra}
              onChange={(e) => setMaoDeObra(e.target.value)}
              placeholder="0,00"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="data">Data do pedido *</label>
          <input
            id="data"
            type="date"
            className="form-input"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="form-submit-btn" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar pedido'}
        </button>
      </form>
    </div>
  );
};

export default NovoPedidoTab;
