import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/codeblock";

interface CodeExecuteLayoutProps {
    title: string;
    subtitle?: string;
    description?: ReactNode;

    codeTitle?: string;
    codeDescription?: ReactNode;
    code: string | null | undefined;
    codeLanguage?: string;

    executeTitle?: string;
    executeDescription?: ReactNode;
    execute: ReactNode;

    footer?: ReactNode;
}

export default function CodeExecuteLayout({
    title,
    subtitle,
    description,
    codeTitle = "Código",
    codeDescription = "Código real usado en el backend.",
    code,
    codeLanguage = "python",
    executeTitle = "Ejecución",
    executeDescription,
    execute,
    footer,
}: CodeExecuteLayoutProps) {
    return (
        <div className="w-full px-4 py-6 lg:h-full">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:h-full">
                <Card className="shrink-0">
                    <CardHeader className="py-4">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            {title}
                            {subtitle ? (
                                <span className="text-xs font-normal text-muted-foreground">
                                    {subtitle}
                                </span>
                            ) : null}
                        </CardTitle>
                        {description ? (
                            <CardDescription>{description}</CardDescription>
                        ) : null}
                    </CardHeader>
                </Card>

                <div className="grid grid-cols-1 gap-6 lg:flex-1 lg:min-h-0 lg:grid-cols-12">
                    <Card className="flex flex-col overflow-hidden lg:min-h-0 lg:col-span-7">
                        <CardHeader className="py-4">
                            <CardTitle className="text-lg">{codeTitle}</CardTitle>
                            <CardDescription className="text-xs">
                                {codeDescription}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="overflow-visible lg:flex-1 lg:min-h-0 lg:overflow-auto">
                            {code ? (
                                <CodeBlock
                                    code={code}
                                    language={codeLanguage}
                                    style={{ minHeight: 260 }}
                                />
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    Cargando código...
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col overflow-hidden lg:min-h-0 lg:col-span-5">
                        <CardHeader className="py-4">
                            <CardTitle className="text-lg">{executeTitle}</CardTitle>
                            {executeDescription ? (
                                <CardDescription>{executeDescription}</CardDescription>
                            ) : null}
                        </CardHeader>
                        <CardContent className="overflow-visible lg:flex-1 lg:min-h-0 lg:overflow-auto">
                            {execute}
                        </CardContent>
                        {footer ? (
                            <CardFooter className="text-xs text-muted-foreground">
                                {footer}
                            </CardFooter>
                        ) : null}
                    </Card>
                </div>
            </div>
        </div>
    );
}
