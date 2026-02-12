export interface Crianca {
    id?: number;
    nome: string;
    dataNascimento: string;
    responsavel: string;
    telefone: string;
    restricaoAlimentar?: boolean;
    descricaoRestricaoAlimentar?: string | null;
    necessidadeEspecial?: boolean;
    descricaoNecessidadeEspecial?: string | null;
    autorizaUsoImagem?: boolean;
    autorizaTrocaFralda?: boolean;
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
