import { Link, useLocation } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
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
                        {routes.map((route) => {
                            const isActive = location.pathname === route.path;
                            return (
                                <NavigationMenuItem key={route.path}>
                                    <NavigationMenuLink
                                        asChild
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            isActive && "bg-accent text-accent-foreground font-semibold"
                                        )}
                                        data-active={isActive ? "" : undefined}
                                    >
                                        <Link to={route.path}>{route.label}</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            );
                        })}
                    </NavigationMenuList>
                </NavigationMenu>
                <ThemeSwitcher />
            </div>
        </header>
    );
}
