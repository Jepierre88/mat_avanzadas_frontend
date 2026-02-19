import { useEffect, useState } from "react";

import type { ViewResponse } from "@/app/domain/types/api.types";
import { tecnicasConteoApi } from "@/app/infrastructure/services/tecnicas-conteo.service";

export function useExerciseView() {
    const [view, setView] = useState<ViewResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        tecnicasConteoApi
            .getView()
            .then(setView)
            .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : "Error al cargar el ejercicio");
            })
            .finally(() => setLoading(false));
    }, []);

    const statement = typeof (view as any)?.statement === "string" ? (view as any).statement as string : null;

    return { view, loading, error, statement };
}
