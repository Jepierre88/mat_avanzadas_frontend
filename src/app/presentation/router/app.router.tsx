import { BrowserRouter } from "react-router-dom";
import AppLayout from "../layout/app.layout";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AppLayout />
        </BrowserRouter>
    );
}