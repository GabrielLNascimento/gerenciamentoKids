import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Culto, cultosAPI } from '../services/api';
import CultoForm from '../components/CultoForm';

const CriarCultoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [culto, setCulto] = useState<Culto | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && id !== 'novo') {
      setLoading(true);
      cultosAPI
        .obter(parseInt(id))
        .then((response) => {
          setCulto(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erro ao carregar culto:', error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = (cultoData: Omit<Culto, 'id'>) => {
    if (id && id !== 'novo') {
      cultosAPI
        .atualizar(parseInt(id), cultoData)
        .then(() => {
          navigate('/cultos');
        })
        .catch((error) => {
          console.error('Erro ao atualizar culto:', error);
          alert('Erro ao atualizar culto');
        });
    } else {
      cultosAPI
        .criar(cultoData)
        .then(() => {
          navigate('/cultos');
        })
        .catch((error) => {
          console.error('Erro ao criar culto:', error);
          alert('Erro ao criar culto');
        });
    }
  };

  const handleCancel = () => {
    navigate('/cultos');
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {id && id !== 'novo' ? 'Editar Culto' : 'Novo Culto'}
        </h1>
        <p className="text-gray-600">
          {id && id !== 'novo' ? 'Atualize as informações do culto' : 'Preencha os dados do novo culto'}
        </p>
      </div>

      <div className="card">
        <CultoForm culto={culto} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default CriarCultoPage;
