import { api } from "../api/api.client";
import type { ViewResponse } from "../../domain/types/api.types";

const BASE = "/api/mat-inf/tecnicas-conteo";

export const tecnicasConteoApi = {
    getView: () => api.get<ViewResponse>(`${BASE}/view`),
};
