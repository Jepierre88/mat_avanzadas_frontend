import { forwardRef } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/codeblock";
import type { ViewResponse } from "@/app/domain/types/api.types";

export interface DiceActivitySectionProps {
    view: ViewResponse | null;
    statement: string | null;
    loading: boolean;
    error: string | null;
}

/**
 * Parse the statement string into structured sections for nicer rendering.
 * Returns an array of { heading, items } blocks.
 */
function parseStatement(raw: string) {
    const lines = raw.split("\n").filter((l) => l.trim() !== "");
    const sections: { heading: string; items: string[] }[] = [];
    let current: { heading: string; items: string[] } | null = null;

    for (const line of lines) {
        const trimmed = line.trim();

        // Lines starting with "o " are sub-items
        if (trimmed.startsWith("o ")) {
            if (current) current.items.push(trimmed.slice(2));
            continue;
        }

        // Numbered items (e.g. "1. …", "2. …")
        if (/^\d+\.\s/.test(trimmed)) {
            if (current) current.items.push(trimmed);
            continue;
        }

        // Everything else is a heading / standalone line
        if (current) sections.push(current);
        current = { heading: trimmed, items: [] };
    }
    if (current) sections.push(current);
    return sections;
}

export const DiceActivitySection = forwardRef<HTMLElement, DiceActivitySectionProps>(
    ({ view, statement, loading, error }, ref) => {
        return (
            <section ref={ref} className="min-h-full snap-start">
                <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-6 px-4 py-10">
                    {/* ── Header ── */}
                    <Card className="shrink-0">
                        <CardHeader className="py-4">
                            <CardTitle className="text-2xl">
                                {view?.title ?? "Actividad"}
                            </CardTitle>
                            {view?.description ? (
                                <CardDescription>{view.description}</CardDescription>
                            ) : null}
                        </CardHeader>
                    </Card>

                    {/* ── Loading / Error states ── */}
                    {loading ? (
                        <Card className="flex-1">
                            <CardContent className="py-10 text-center text-sm text-muted-foreground">
                                Cargando ejercicio…
                            </CardContent>
                        </Card>
                    ) : error ? (
                        <Card className="border-destructive/30">
                            <CardContent className="py-6 text-sm text-destructive">
                                {error}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                            {/* ── Code panel ── */}
                            <Card className="flex flex-col overflow-hidden lg:col-span-7">
                                <CardHeader className="py-4">
                                    <CardTitle className="text-lg">Código Python</CardTitle>
                                    <CardDescription className="text-xs">
                                        Código real que ejecuta el backend para este ejercicio.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-auto">
                                    {view?.code ? (
                                        <CodeBlock
                                            code={view.code}
                                            language="python"
                                            style={{ minHeight: 260 }}
                                        />
                                    ) : (
                                        <div className="text-sm text-muted-foreground">
                                            Código no disponible.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* ── Statement panel ── */}
                            <Card className="flex flex-col overflow-hidden lg:col-span-5">
                                <CardHeader className="py-4">
                                    <CardTitle className="text-lg">Enunciado</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-auto">
                                    {statement ? (
                                        <div className="flex flex-col gap-4 text-sm leading-relaxed">
                                            {parseStatement(statement).map((section, i) => (
                                                <div key={i}>
                                                    <p className="font-semibold">{section.heading}</p>
                                                    {section.items.length > 0 && (
                                                        <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                                                            {section.items.map((item, j) => (
                                                                <li key={j}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">
                                            Enunciado no disponible.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </section>
        );
    },
);

DiceActivitySection.displayName = "DiceActivitySection";
