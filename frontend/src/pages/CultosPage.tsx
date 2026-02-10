import { useState, useEffect } from 'react';
import { Culto, cultosAPI } from '../services/api';
import CultosTable from '../components/CultosTable';
import { useNavigate } from 'react-router-dom';

const CultosPage = () => {
  const [cultos, setCultos] = useState<Culto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarCultos();
  }, []);

  const carregarCultos = () => {
    setLoading(true);
    cultosAPI
      .listar()
      .then((response) => {
        setCultos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar cultos:', error);
        setLoading(false);
      });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este culto?')) {
      cultosAPI
        .deletar(id)
        .then(() => {
          carregarCultos();
        })
        .catch((error) => {
          console.error('Erro ao deletar culto:', error);
          alert('Erro ao deletar culto');
        });
    }
  };

  const handleEdit = (culto: Culto) => {
    navigate(`/cultos/${culto.id}/editar`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciamento de Cultos</h1>
          <p className="text-gray-600">Visualize e gerencie os cultos cadastrados</p>
        </div>
        <button onClick={() => navigate('/cultos/novo')} className="btn-primary">
          + Novo Culto
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <CultosTable cultos={cultos} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default CultosPage;
