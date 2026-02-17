import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, GraduationCap, BookOpen } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";

const integrantes = [
    { nombre: "Jean Pierre Ortiz", iniciales: "JP" },
    { nombre: "Pepito Zuñiga", iniciales: "PZ" },
    { nombre: "Juan Perez", iniciales: "JP" },
];

export default function HomePage() {
    return (
        <div className="flex flex-col items-center h-full px-4 py-8 gap-6">
            <BlurFade delay={0.1} inView>
                <div className="flex flex-col items-center text-center gap-3 max-w-xl mx-auto">
                    <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1">
                        <BookOpen className="h-3 w-3 text-primary" />
                        <span className="text-[11px] font-medium tracking-wide text-secondary-foreground">
                            Instituto Tecnológico Metropolitano
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                        Matemáticas para{" "}
                        <span className="text-primary">Informática</span>
                        {" "}avanzada
                    </h1>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                            Prof. Roberto Carlos Rahamut Suteu
                        </span>
                    </div>

                    <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
                        Herramientas interactivas para explorar los fundamentos
                        matemáticos de la computación.
                    </p>

                    <Button asChild size="sm" className="gap-2 rounded-full px-5">
                        <Link to="/tecnicas-de-conteo">
                            Comenzar
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>
            </BlurFade>

            {/* Integrantes */}
            <div className="w-full max-w-md mx-auto flex-1 min-h-0">
                <BlurFade delay={0.3} inView>
                    <Card className="relative overflow-hidden">
                        <CardContent className="flex flex-col items-center gap-3 py-5">
                            <div className="rounded-full bg-primary/10 p-2">
                                <Users className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                                Integrantes
                            </span>
                            <Separator className="w-10" />
                            <div className="flex flex-col gap-2 w-full">
                                {integrantes.map((m, i) => (
                                    <BlurFade key={m.nombre} delay={0.4 + i * 0.08} inView>
                                        <div className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2">
                                            <Avatar className="h-7 w-7 border-2 border-primary/20">
                                                <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                                                    {m.iniciales}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium tracking-tight">
                                                {m.nombre}
                                            </span>
                                        </div>
                                    </BlurFade>
                                ))}
                            </div>
                        </CardContent>
                        <BorderBeam duration={10} size={120} />
                    </Card>
                </BlurFade>
            </div>
        </div>
    );
}
