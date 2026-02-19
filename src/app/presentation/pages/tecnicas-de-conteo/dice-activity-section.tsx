import { forwardRef } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DiceActivitySection = forwardRef<HTMLElement>((_props, ref) => {
    return (
        <section ref={ref} className="h-full snap-start">
            <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-4 py-10">
                <Card className="flex flex-1 flex-col">
                    <CardHeader className="py-4">
                        <CardTitle className="text-lg">Actividad</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="h-full w-full rounded-lg border border-dashed bg-muted/10" />
                    </CardContent>
                </Card>
            </div>
        </section>
    );
});

DiceActivitySection.displayName = "DiceActivitySection";
