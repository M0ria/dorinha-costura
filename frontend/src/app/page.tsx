"use client";

import { useState, useEffect } from 'react';
import NovoPedidoTab from '../components/NovoPedidoTab';
import PedidosTab from '../components/PedidosTab';
import AnaliseTab from '../components/AnaliseTab';
import Toast from '../components/Toast';
import type { Pedido, AnaliseData } from '../types';

const BACKEND_URL = 'http://localhost:3001';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'novo' | 'pedidos' | 'analise'>('novo');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [analiseData, setAnaliseData] = useState<AnaliseData | null>(null);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [loadingAnalise, setLoadingAnalise] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const fetchPedidos = async () => {
    setLoadingPedidos(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/pedidos`);
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      }
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
    } finally {
      setLoadingPedidos(false);
    }
  };

  const fetchAnalise = async () => {
    setLoadingAnalise(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/analise`);
      if (response.ok) {
        const data = await response.json();
        setAnaliseData(data);
      }
    } catch (err) {
      console.error('Erro ao buscar dados da análise:', err);
    } finally {
      setLoadingAnalise(false);
    }
  };

  const reloadAll = () => {
    fetchPedidos();
    fetchAnalise();
  };

  useEffect(() => {
    reloadAll();
  }, []);

  const handleCreateSuccess = (message: string) => {
    setToast({ show: true, message });
    reloadAll();
    setActiveTab('pedidos');
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/pedidos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setToast({ show: true, message: 'Pedido excluído com sucesso!' });
        reloadAll();
      } else {
        alert('Erro ao excluir o pedido.');
      }
    } catch (err) {
      console.error('Erro ao excluir pedido:', err);
      alert('Erro de conexão ao excluir o pedido.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-title-container">
          <svg className="scissors-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
            <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
            <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
          </svg>
          <h1>Costura da Dorinha</h1>
        </div>
        <p>Araturi, Caucaia/CE — controle de pedidos</p>
      </header>

      <div className="tabs-container">
        <button
          type="button"
          className={`tab-button ${activeTab === 'novo' ? 'active' : ''}`}
          onClick={() => setActiveTab('novo')}
        >
          Novo pedido
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'pedidos' ? 'active' : ''}`}
          onClick={() => setActiveTab('pedidos')}
        >
          Pedidos
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'analise' ? 'active' : ''}`}
          onClick={() => setActiveTab('analise')}
        >
          Análise
        </button>
      </div>

      <main style={{ flexGrow: 1 }}>
        {activeTab === 'novo' && (
          <NovoPedidoTab onSuccess={handleCreateSuccess} backendUrl={BACKEND_URL} />
        )}
        {activeTab === 'pedidos' && (
          <PedidosTab pedidos={pedidos} onDelete={handleDelete} loading={loadingPedidos} />
        )}
        {activeTab === 'analise' && (
          <AnaliseTab pedidos={pedidos} analiseData={analiseData} loading={loadingAnalise} />
        )}
      </main>

      {toast.show && (
        <Toast
          message={toast.message}
          onClose={() => setToast({ show: false, message: '' })}
        />
      )}
    </div>
  );
}
