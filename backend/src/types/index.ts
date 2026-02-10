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

export interface Presenca {
    id?: number;
    criancaId: number;
    cultoId: number;
    createdAt?: string;
}

export interface Estatisticas {
    totalCriancas: number;
    totalCultos: number;
    frequenciaMedia: number;
}
