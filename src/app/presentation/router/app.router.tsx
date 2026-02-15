import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "../layout/app.layout";

const HomePage = lazy(() => import("../pages/home.page"));
const Conteo1Page = lazy(() => import("../pages/conteo1.page"));
const ConjuntosPage = lazy(() => import("../pages/conjuntos.page"));

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="conteo-1" element={<Conteo1Page />} />
                    <Route path="conjuntos" element={<ConjuntosPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}