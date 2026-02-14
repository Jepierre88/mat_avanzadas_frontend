import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import CodeExecuteLayout from "@/app/presentation/components/code-execute-layout";
import { operacionesConjuntosApi } from "@/app/infrastructure/services/operaciones-conjuntos.service";
import type { ViewResponse } from "@/app/domain/types/api.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function fmtSet(items: string[]) {
    return `{ ${items.join(", ")} }`;
}

export default function ConjuntosPage() {
    const [view, setView] = useState<ViewResponse | null>(null);

    const [a, setA] = useState("1,2,3,4");
    const [b, setB] = useState("3,4,5");
    const [x, setX] = useState("4");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        operacionesConjuntosApi.getView().then(setView).catch(() => {
            setView(null);
        });
    }, []);

    const statement = useMemo(() => {
        const raw = (view as any)?.statement;
        return typeof raw === "string" ? raw : null;
    }, [view]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setResult(null);

        try {
            const res = await operacionesConjuntosApi.execute({
                a,
                b,
                x: x.trim() === "" ? undefined : x,
            });
            setResult(res.data);
        } catch (err: any) {
            setError(err?.message ?? "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <CodeExecuteLayout
            title="Operaciones con Conjuntos"
            subtitle="A ∪ B, A ∩ B, A − B, B − A, A △ B"
            description={
                <>Ejercicio típico de conjuntos con parámetros múltiples.</>
            }
            codeTitle="Script (Python)"
            codeDescription="Código real que ejecuta el backend."
            code={view?.code}
            codeLanguage="python"
            executeTitle="Enunciado + Ejecución"
            executeDescription={
                "Ingresa A, B (separados por coma) y opcionalmente x para pertenencia."
            }
            footer="Powered by Python • Flask API"
            execute={
                <div className="flex flex-col gap-6">
                    <Card className="bg-muted/10">
                        <CardHeader className="py-4">
                            <CardTitle className="text-base">Enunciado</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            {statement ??
                                "Dado A y B, calcula unión, intersección, diferencias y diferencia simétrica. Opcional: verifica pertenencia de x."}
                        </CardContent>
                    </Card>

                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="a">Conjunto A</Label>
                            <Input
                                id="a"
                                value={a}
                                onChange={(e) => setA(e.target.value)}
                                placeholder="Ej: 1,2,3"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="b">Conjunto B</Label>
                            <Input
                                id="b"
                                value={b}
                                onChange={(e) => setB(e.target.value)}
                                placeholder="Ej: 2,3,4"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="x">Elemento x (opcional)</Label>
                            <Input
                                id="x"
                                value={x}
                                onChange={(e) => setX(e.target.value)}
                                placeholder="Ej: 4"
                            />
                            <div className="text-xs text-muted-foreground">
                                Si lo dejas vacío, no se evalúa pertenencia.
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Ejecutando..." : "Ejecutar"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={loading}
                                onClick={() => {
                                    setA("1,2,3,4");
                                    setB("3,4,5");
                                    setX("4");
                                    setResult(null);
                                    setError(null);
                                }}
                            >
                                Usar ejemplo
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={loading}
                                onClick={() => {
                                    setA("");
                                    setB("");
                                    setX("");
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
                        <Card>
                            <CardHeader className="py-4">
                                <CardTitle className="text-base">Resultado</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3 text-sm">
                                <div className="grid gap-1">
                                    <div className="text-muted-foreground">A</div>
                                    <div className="font-mono">{fmtSet(result.A)}</div>
                                </div>
                                <div className="grid gap-1">
                                    <div className="text-muted-foreground">B</div>
                                    <div className="font-mono">{fmtSet(result.B)}</div>
                                </div>

                                <div className="grid gap-1">
                                    <div className="text-muted-foreground">A ∪ B</div>
                                    <div className="font-mono">{fmtSet(result.union)}</div>
                                </div>
                                <div className="grid gap-1">
                                    <div className="text-muted-foreground">A ∩ B</div>
                                    <div className="font-mono">{fmtSet(result.interseccion)}</div>
                                </div>
                                <div className="grid gap-1">
                                    <div className="text-muted-foreground">A − B</div>
                                    <div className="font-mono">{fmtSet(result.diferencia_A_B)}</div>
                                </div>
                                <div className="grid gap-1">
                                    <div className="text-muted-foreground">B − A</div>
                                    <div className="font-mono">{fmtSet(result.diferencia_B_A)}</div>
                                </div>
                                <div className="grid gap-1">
                                    <div className="text-muted-foreground">A △ B</div>
                                    <div className="font-mono">{fmtSet(result.diferencia_simetrica)}</div>
                                </div>

                                {result.x ? (
                                    <div className="grid gap-1">
                                        <div className="text-muted-foreground">Pertenencia</div>
                                        <div className="font-mono">
                                            x = {result.x} → x ∈ A: {String(result.pertenece_A)} · x ∈ B: {String(result.pertenece_B)}
                                        </div>
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="rounded-md border border-dashed bg-muted/10 px-3 py-4 text-sm text-muted-foreground">
                            Ejecuta el ejercicio para ver el resultado.
                        </div>
                    )}
                </div>
            }
        />
    );
}
