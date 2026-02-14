import { Link, useLocation } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import ThemeSwitcher from "./theme-switcher";

const routes = [
    { path: "/", label: "Inicio" },
    { path: "/conteo-1", label: "Conteo 1" },
];

export default function Navbar() {
    const location = useLocation();

    return (
        <header className="shrink-0 border-b">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <NavigationMenu>
                    <NavigationMenuList>
                        {routes.map((route) => (
                            <NavigationMenuItem key={route.path}>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                    data-active={location.pathname === route.path ? "" : undefined}
                                >
                                    <Link to={route.path}>{route.label}</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
                <ThemeSwitcher />
            </div>
        </header>
    );
}
