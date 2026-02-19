
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { permutacionSimpleApi } from "@/app/infrastructure/services/permutacion-simple.service";
import type { ViewResponse, PermutacionSimpleResult, Walkthrough } from "@/app/domain/types/api.types";
import CodeExecuteLayout from "@/app/presentation/components/code-execute-layout";

export default function Conteo1Page() {
    const [view, setView] = useState<ViewResponse | null>(null);
    const [n, setN] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PermutacionSimpleResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        permutacionSimpleApi.getView().then(setView);
    }, []);

    /* Extract walkthrough if present */
    const walkthrough: Walkthrough | null =
        view && typeof view.walkthrough === "object" && view.walkthrough !== null
            ? (view.walkthrough as Walkthrough)
            : null;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setResult(null);
        setLoading(true);
        try {
            const num = parseInt(n, 10);
            if (isNaN(num)) throw new Error("Debes ingresar un número entero");
            const res = await permutacionSimpleApi.execute({ n: num });
            setResult(res.data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error desconocido");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <CodeExecuteLayout
            title="Permutación Simple"
            subtitle="P(n) = n!"
            description={
                <>
                    Calcula el número de permutaciones simples de <b>n</b> elementos.
                    Ajusta el valor y observa el código Python real.
                </>
            }
            codeTitle="Código Python"
            codeDescription={
                "Este es el código real que ejecuta el backend para resolver el ejercicio."
            }
            code={view?.code}
            codeLanguage="python"
            walkthrough={walkthrough}
            executeTitle="Ejecución"
            executeDescription="Ingresa un valor para n y ejecuta."
            footer="Powered by Python • Flask API"
            execute={
                <div className="flex h-full flex-col gap-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="n">Valor de n</Label>
                            <Input
                                id="n"
                                type="number"
                                min={0}
                                step={1}
                                value={n}
                                onChange={(e) => setN(e.target.value)}
                                placeholder="Ej: 5"
                                required
                            />
                            <div className="text-xs text-muted-foreground">
                                Tip: P(5) = 120
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Calculando..." : "Calcular"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={loading}
                                onClick={() => {
                                    setN("");
                                    setResult(null);
                                    setError(null);
                                }}
                            >
                                Limpiar
                            </Button>
                        </div>
                    </form>

                    {error ? (
                        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                            {error}
                        </div>
                    ) : null}

                    {result ? (
                        <Card className="bg-accent/40 border-primary/30">
                            <CardHeader className="py-4">
                                <CardTitle className="text-lg text-primary">
                                    Resultado
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        n
                                    </span>
                                    <span className="font-mono text-sm">{result.n}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Permutaciones
                                    </span>
                                    <span className="text-xl font-bold text-primary">
                                        {result.resultado.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Fórmula
                                    </span>
                                    <div className="w-fit rounded bg-muted/60 px-2 py-1 font-mono text-sm">
                                        {result.formula}
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {result.explicacion}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="flex-1 rounded-md border border-dashed bg-muted/10 px-3 py-4 text-sm text-muted-foreground">
                            Ejecuta el ejercicio para ver el resultado.
                        </div>
                    )}
                </div>
            }
        />
    );
}
