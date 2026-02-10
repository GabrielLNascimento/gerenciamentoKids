import { useState, useEffect } from 'react';
import { Crianca, criancasAPI } from '../services/api';

interface CriancaSeletorProps {
  cultoId: number;
  criancasNoCulto: Crianca[];
  onAdicionar: (criancaId: number) => void;
  onRemover: (criancaId: number) => void;
}

const CriancaSeletor = ({ cultoId: _cultoId, criancasNoCulto, onAdicionar, onRemover: _onRemover }: CriancaSeletorProps) => {
  const [busca, setBusca] = useState('');
  const [criancas, setCriancas] = useState<Crianca[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (busca.length > 0) {
      setLoading(true);
      criancasAPI
        .buscar(busca)
        .then((response) => {
          setCriancas(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erro ao buscar crianças:', error);
          setLoading(false);
        });
    } else {
      setCriancas([]);
    }
  }, [busca]);

  const criancasDisponiveis = criancas.filter(
    (c) => !criancasNoCulto.some((cnc) => cnc.id === c.id)
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-2">
          Buscar Criança para Adicionar
        </label>
        <input
          type="text"
          id="busca"
          className="input-field"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Digite o nome da criança..."
        />
      </div>

      {loading && <div className="text-center py-4 text-gray-500">Buscando...</div>}

      {busca.length > 0 && !loading && criancasDisponiveis.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Nenhuma criança encontrada ou todas já estão no culto.
        </div>
      )}

      {criancasDisponiveis.length > 0 && (
        <div className="space-y-2">
          {criancasDisponiveis.map((crianca) => (
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
                onClick={() => crianca.id && onAdicionar(crianca.id)}
                className="btn-primary text-sm"
              >
                Adicionar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CriancaSeletor;
