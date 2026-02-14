/* ── Response wrappers ── */

export interface ViewResponse {
    type: "view";
    title: string;
    description: string;
    code: string;
    params: ParamDescriptor[];
    /** Cualquier dato extra que el backend envíe */
    [key: string]: unknown;
}

export interface DataResponse<T> {
    type: "data";
    data: T;
}

export interface ErrorResponse {
    type: "error";
    message: string;
}

export type ApiResponse<T> = DataResponse<T> | ErrorResponse;

/* ── Param descriptor (lo que viene en /view) ── */

export interface ParamDescriptor {
    name: string;
    type: string;
    description: string;
}

/* ── Permutación Simple ── */

export interface PermutacionSimpleParams {
    n: number;
}

export interface PermutacionSimpleResult {
    n: number;
    resultado: number;
    formula: string;
    explicacion: string;
}
