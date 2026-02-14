import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "../components/theme-provider";
import Navbar from "../components/navbar";
import HomePage from "../pages/home.page";
import Conteo1Page from "../pages/conteo1.page";

export default function AppLayout() {
    return (
        <ThemeProvider>
            <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground">
                <Navbar />
                <main className="flex-1 overflow-auto">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/conteo-1" element={<Conteo1Page />} />
                    </Routes>
                </main>
            </div>
        </ThemeProvider>
    );
}
