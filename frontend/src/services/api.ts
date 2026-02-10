import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Crianca {
    id?: number;
    nome: string;
    idade: number;
    responsavel: string;
    telefone: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Culto {
    id?: number;
    nome: string;
    periodo: string;
    data: string;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Estatisticas {
    totalCriancas: number;
    totalCultos: number;
    frequenciaMedia: number;
}

// APIs de Crianças
export const criancasAPI = {
    listar: () => api.get<Crianca[]>('/criancas'),
    buscar: (nome: string) =>
        api.get<Crianca[]>(`/criancas/buscar?nome=${encodeURIComponent(nome)}`),
    obter: (id: number) => api.get<Crianca>(`/criancas/${id}`),
    criar: (crianca: Omit<Crianca, 'id'>) =>
        api.post<Crianca>('/criancas', crianca),
    atualizar: (id: number, crianca: Partial<Crianca>) =>
        api.put<Crianca>(`/criancas/${id}`, crianca),
    deletar: (id: number) => api.delete(`/criancas/${id}`),
};

// APIs de Cultos
export const cultosAPI = {
    listar: () => api.get<Culto[]>('/cultos'),
    obter: (id: number) => api.get<Culto>(`/cultos/${id}`),
    criar: (culto: Omit<Culto, 'id'>) => api.post<Culto>('/cultos', culto),
    atualizar: (id: number, culto: Partial<Culto>) =>
        api.put<Culto>(`/cultos/${id}`, culto),
    deletar: (id: number) => api.delete(`/cultos/${id}`),
    adicionarCrianca: (cultoId: number, criancaId: number) =>
        api.post(`/cultos/${cultoId}/criancas`, { cultoId, criancaId }),
    removerCrianca: (cultoId: number, criancaId: number) =>
        api.delete(`/cultos/${cultoId}/criancas/${criancaId}`),
    listarCriancas: (cultoId: number) =>
        api.get<Crianca[]>(`/cultos/${cultoId}/criancas`),
};

// APIs de Estatísticas
export const estatisticasAPI = {
    obter: () => api.get<Estatisticas>('/estatisticas'),
};

export default api;
