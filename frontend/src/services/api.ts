import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Crianca {
    id?: number;
    nome: string;
    dataNascimento: string;
    responsavel: string;
    telefone: string;
    codigo?: number;
    restricaoAlimentar?: boolean;
    descricaoRestricaoAlimentar?: string | null;
    necessidadeEspecial?: boolean;
    descricaoNecessidadeEspecial?: string | null;
    autorizaUsoImagem?: boolean;
    autorizaTrocaFralda?: boolean;
    relatorio?: string | null;
    createdAt?: string;
    updatedAt?: string;
    presencaData?: string;
    checkedOut?: boolean;
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
    listar: () => api.get<Crianca[]>("/criancas"),
    buscar: (nome: string) =>
        api.get<Crianca[]>(`/criancas/buscar?nome=${encodeURIComponent(nome)}`),
    obter: (id: number) => api.get<Crianca>(`/criancas/${id}`),
    criar: (crianca: Omit<Crianca, "id">) =>
        api.post<Crianca>("/criancas", crianca),
    atualizar: (id: number, crianca: Partial<Crianca>) =>
        api.put<Crianca>(`/criancas/${id}`, crianca),
    atualizarRelatorio: (id: number, relatorio: string | null) =>
        api.patch<Crianca>(`/criancas/${id}/relatorio`, { relatorio }),
    deletar: (id: number) => api.delete(`/criancas/${id}`),
    listarFrequencia: (id: number) =>
        api.get<number[]>(`/criancas/${id}/frequencia`),
};

// APIs de Cultos
export const cultosAPI = {
    listar: () => api.get<Culto[]>("/cultos"),
    obter: (id: number) => api.get<Culto>(`/cultos/${id}`),
    criar: (culto: Omit<Culto, "id">) => api.post<Culto>("/cultos", culto),
    atualizar: (id: number, culto: Partial<Culto>) =>
        api.put<Culto>(`/cultos/${id}`, culto),
    deletar: (id: number) => api.delete(`/cultos/${id}`),
    adicionarCrianca: (cultoId: number, criancaId: number) =>
        api.post(`/cultos/${cultoId}/criancas`, { cultoId, criancaId }),
    removerCrianca: (cultoId: number, criancaId: number) =>
        api.delete(`/cultos/${cultoId}/criancas/${criancaId}`),
    listarCriancas: (cultoId: number) =>
        api.get<Crianca[]>(`/cultos/${cultoId}/criancas`),
    marcarCheckout: (cultoId: number, criancaId: number, checkedOut: boolean) =>
        api.patch(`/cultos/${cultoId}/criancas/${criancaId}/checkout`, {
            checkedOut,
        }),
};

// APIs de Estatísticas
export const estatisticasAPI = {
    obter: () => api.get<Estatisticas>("/estatisticas"),
};

export interface RelatorioItem {
    id: number;
    nome: string;
    periodo: string;
    data: string;
    bebes: number;
    medios1: number;
    medios2: number;
    grandes: number;
    total: number;
}

// APIs de Relatório
export const relatorioAPI = {
    obter: () => api.get<RelatorioItem[]>("/relatorio"),
};

export default api;
