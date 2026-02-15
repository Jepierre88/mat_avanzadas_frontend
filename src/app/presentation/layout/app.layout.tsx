import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../components/theme-provider";
import Navbar from "../components/navbar";

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
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </ThemeProvider>
    );
}
