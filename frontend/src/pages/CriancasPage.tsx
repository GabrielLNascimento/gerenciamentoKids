import { useState, useEffect } from 'react';
import { Crianca, criancasAPI } from '../services/api';
import CriancasTable from '../components/CriancasTable';
import CriancaForm from '../components/CriancaForm';

const CriancasPage = () => {
  const [criancas, setCriancas] = useState<Crianca[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [criancaEditando, setCriancaEditando] = useState<Crianca | undefined>();

  useEffect(() => {
    carregarCriancas();
  }, []);

  const carregarCriancas = () => {
    setLoading(true);
    criancasAPI
      .listar()
      .then((response) => {
        setCriancas(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar crianças:', error);
        setLoading(false);
      });
  };

  const handleCriar = (crianca: Omit<Crianca, 'id'>) => {
    criancasAPI
      .criar(crianca)
      .then(() => {
        carregarCriancas();
        setShowForm(false);
      })
      .catch((error) => {
        console.error('Erro ao criar criança:', error);
        alert('Erro ao criar criança');
      });
  };

  const handleAtualizar = (crianca: Omit<Crianca, 'id'>) => {
    if (!criancaEditando?.id) return;

    criancasAPI
      .atualizar(criancaEditando.id, crianca)
      .then(() => {
        carregarCriancas();
        setShowForm(false);
        setCriancaEditando(undefined);
      })
      .catch((error) => {
        console.error('Erro ao atualizar criança:', error);
        alert('Erro ao atualizar criança');
      });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta criança?')) {
      criancasAPI
        .deletar(id)
        .then(() => {
          carregarCriancas();
        })
        .catch((error) => {
          console.error('Erro ao deletar criança:', error);
          alert('Erro ao deletar criança');
        });
    }
  };

  const handleEdit = (crianca: Crianca) => {
    setCriancaEditando(crianca);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setCriancaEditando(undefined);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciamento de Crianças</h1>
          <p className="text-gray-600">Cadastre e gerencie as crianças do sistema</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + Nova Criança
          </button>
        )}
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {criancaEditando ? 'Editar Criança' : 'Nova Criança'}
          </h2>
          <CriancaForm
            crianca={criancaEditando}
            onSubmit={criancaEditando ? handleAtualizar : handleCriar}
            onCancel={handleCancel}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <CriancasTable criancas={criancas} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default CriancasPage;
