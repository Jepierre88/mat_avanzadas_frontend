import { api } from "../api/api.client";
import type {
    ViewResponse,
    DataResponse,
    PermutacionSimpleParams,
    PermutacionSimpleResult,
} from "../../domain/types/api.types";

const BASE = "/api/mat-inf/permutacion-simple";

export const permutacionSimpleApi = {
    getView: () => api.get<ViewResponse>(`${BASE}/view`),

    execute: (params: PermutacionSimpleParams) =>
        api.post<DataResponse<PermutacionSimpleResult>>(`${BASE}/execute`, params),
};
