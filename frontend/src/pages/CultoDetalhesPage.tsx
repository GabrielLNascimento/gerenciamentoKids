import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Culto, Crianca, cultosAPI } from '../services/api';
import CriancaSeletor from '../components/CriancaSeletor';

const CultoDetalhesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [culto, setCulto] = useState<Culto | null>(null);
  const [criancas, setCriancas] = useState<Crianca[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      carregarDados();
    }
  }, [id]);

  const carregarDados = () => {
    if (!id) return;

    setLoading(true);
    Promise.all([
      cultosAPI.obter(parseInt(id)),
      cultosAPI.listarCriancas(parseInt(id)),
    ])
      .then(([cultoResponse, criancasResponse]) => {
        setCulto(cultoResponse.data);
        setCriancas(criancasResponse.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      });
  };

  const handleAdicionarCrianca = (criancaId: number) => {
    if (!id) return;

    cultosAPI
      .adicionarCrianca(parseInt(id), criancaId)
      .then(() => {
        carregarDados();
      })
      .catch((error) => {
        console.error('Erro ao adicionar criança:', error);
        alert('Erro ao adicionar criança ao culto');
      });
  };

  const handleRemoverCrianca = (criancaId: number) => {
    if (!id) return;

    if (window.confirm('Tem certeza que deseja remover esta criança do culto?')) {
      cultosAPI
        .removerCrianca(parseInt(id), criancaId)
        .then(() => {
          carregarDados();
        })
        .catch((error) => {
          console.error('Erro ao remover criança:', error);
          alert('Erro ao remover criança do culto');
        });
    }
  };

  const formatarData = (data: string) => {
    const [year, month, day] = data.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8">Carregando...</div>
      </div>
    );
  }

  if (!culto) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8 text-red-600">Culto não encontrado</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <button onClick={() => navigate('/cultos')} className="btn-secondary mb-4">
          ← Voltar
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{culto.nome}</h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          <span>
            <strong>Período:</strong> {culto.periodo}
          </span>
          <span>
            <strong>Data:</strong> {formatarData(culto.data)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Crianças Presentes ({criancas.length})
          </h2>
          {criancas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma criança adicionada ainda.
            </div>
          ) : (
            <div className="space-y-2">
              {criancas.map((crianca) => (
                <div
                  key={crianca.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{crianca.nome}</p>
                    <p className="text-sm text-gray-500">
                      {crianca.idade} anos • {crianca.responsavel}
                    </p>
                  </div>
                  <button
                    onClick={() => crianca.id && handleRemoverCrianca(crianca.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Adicionar Criança</h2>
          <CriancaSeletor
            cultoId={parseInt(id!)}
            criancasNoCulto={criancas}
            onAdicionar={handleAdicionarCrianca}
            onRemover={handleRemoverCrianca}
          />
        </div>
      </div>
    </div>
  );
};

export default CultoDetalhesPage;
