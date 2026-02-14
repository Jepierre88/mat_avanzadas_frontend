import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "../components/theme-provider";
import Navbar from "../components/navbar";

const HomePage = lazy(() => import("../pages/home.page"));
const Conteo1Page = lazy(() => import("../pages/conteo1.page"));
const ConjuntosPage = lazy(() => import("../pages/conjuntos.page"));

export default function AppLayout() {
    return (
        <ThemeProvider>
            <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground">
                <Navbar />
                <main className="flex-1 overflow-auto lg:overflow-hidden">
                    <Suspense
                        fallback={
                            <div className="h-full w-full grid place-items-center text-sm text-muted-foreground">
                                Cargando...
                            </div>
                        }
                    >
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/conteo-1" element={<Conteo1Page />} />
                            <Route path="/conjuntos" element={<ConjuntosPage />} />
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </ThemeProvider>
    );
}
