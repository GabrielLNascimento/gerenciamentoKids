import { useState, useEffect } from 'react';
import { Culto } from '../services/api';

interface CultoFormProps {
  culto?: Culto;
  onSubmit: (culto: Omit<Culto, 'id'>) => void;
  onCancel: () => void;
}

const CultoForm = ({ culto, onSubmit, onCancel }: CultoFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    periodo: 'Manhã',
    data: '',
    userId: '',
  });

  useEffect(() => {
    if (culto) {
      setFormData({
        nome: culto.nome,
        periodo: culto.periodo,
        data: culto.data,
        userId: culto.userId || '',
      });
    } else {
      // Definir data padrão como hoje
      const hoje = new Date().toISOString().split('T')[0];
      setFormData({ ...formData, data: hoje });
    }
  }, [culto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nome: formData.nome,
      periodo: formData.periodo,
      data: formData.data,
      userId: formData.userId || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Evento *
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
        <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-1">
          Período *
        </label>
        <select
          id="periodo"
          className="input-field"
          value={formData.periodo}
          onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
          required
        >
          <option value="Manhã">Manhã</option>
          <option value="Tarde">Tarde</option>
          <option value="Noite">Noite</option>
        </select>
      </div>

      <div>
        <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
          Data *
        </label>
        <input
          type="date"
          id="data"
          className="input-field"
          value={formData.data}
          onChange={(e) => setFormData({ ...formData, data: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
          ID do Usuário (opcional)
        </label>
        <input
          type="text"
          id="userId"
          className="input-field"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {culto ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
};

export default CultoForm;
