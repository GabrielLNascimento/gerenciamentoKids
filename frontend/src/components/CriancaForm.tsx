import { useState, useEffect } from 'react';
import { Crianca } from '../services/api';

interface CriancaFormProps {
  crianca?: Crianca;
  onSubmit: (crianca: Omit<Crianca, 'id'>) => void;
  onCancel: () => void;
}

const CriancaForm = ({ crianca, onSubmit, onCancel }: CriancaFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    responsavel: '',
    telefone: '',
  });

  useEffect(() => {
    if (crianca) {
      setFormData({
        nome: crianca.nome,
        idade: crianca.idade.toString(),
        responsavel: crianca.responsavel,
        telefone: crianca.telefone,
      });
    }
  }, [crianca]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nome: formData.nome,
      idade: parseInt(formData.idade),
      responsavel: formData.responsavel,
      telefone: formData.telefone,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
          Nome *
        </label>
        <input
          type="text"
          id="nome"
          className="input-field"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="idade" className="block text-sm font-medium text-gray-700 mb-1">
          Idade *
        </label>
        <input
          type="number"
          id="idade"
          className="input-field"
          value={formData.idade}
          onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
          min="0"
          max="18"
          required
        />
      </div>

      <div>
        <label htmlFor="responsavel" className="block text-sm font-medium text-gray-700 mb-1">
          Responsável *
        </label>
        <input
          type="text"
          id="responsavel"
          className="input-field"
          value={formData.responsavel}
          onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
          Telefone *
        </label>
        <input
          type="tel"
          id="telefone"
          className="input-field"
          value={formData.telefone}
          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          placeholder="11999999999"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {crianca ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
};

export default CriancaForm;
