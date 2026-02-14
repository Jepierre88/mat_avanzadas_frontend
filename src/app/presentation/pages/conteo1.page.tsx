import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Conteo1Page() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Conteo 1</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Contenido de Conteo 1 — próximamente.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
