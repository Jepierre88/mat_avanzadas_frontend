import { api } from "../api/api.client";
import type { DataResponse, ViewResponse } from "../../domain/types/api.types";

export interface OperacionesConjuntosParams {
    a: string;
    b: string;
    x?: string;
}

export interface OperacionesConjuntosResult {
    A: string[];
    B: string[];
    union: string[];
    interseccion: string[];
    diferencia_A_B: string[];
    diferencia_B_A: string[];
    diferencia_simetrica: string[];
    cardinalidades: Record<string, number>;
    x: string | null;
    pertenece_A: boolean | null;
    pertenece_B: boolean | null;
}

const BASE = "/api/mat-inf/operaciones-conjuntos";

export const operacionesConjuntosApi = {
    getView: () => api.get<ViewResponse>(`${BASE}/view`),

    execute: (params: OperacionesConjuntosParams) =>
        api.post<DataResponse<OperacionesConjuntosResult>>(`${BASE}/execute`, params),
};
