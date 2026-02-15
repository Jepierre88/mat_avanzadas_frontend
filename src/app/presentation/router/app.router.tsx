import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "../layout/app.layout";
import HomePage from "../pages/home.page";
import Conteo1Page from "../pages/conteo1.page";
import ConjuntosPage from "../pages/conjuntos.page";


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