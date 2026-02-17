import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ThemeSwitcher from "./theme-switcher";

const routes = [
    { path: "/", label: "Inicio" },
    // { path: "/conteo-1", label: "Conteo 1" },
    // { path: "/conjuntos", label: "Conjuntos" },
    { path: "/tecnicas-de-conteo", label: "Técnicas de Conteo" },
];

export default function Navbar() {
    const location = useLocation();

    return (
        <header className="shrink-0 border-b">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                aria-label="Abrir menú"
                            >
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="md:hidden">
                            <SheetHeader>
                                <SheetTitle>Navegación</SheetTitle>
                            </SheetHeader>

                            <nav className="mt-4 flex flex-col gap-1">
                                {routes.map((route) => {
                                    const isActive = location.pathname === route.path;
                                    return (
                                        <SheetClose key={route.path} asChild>
                                            <Link
                                                to={route.path}
                                                className={cn(
                                                    "hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm",
                                                    isActive &&
                                                        "bg-accent text-accent-foreground font-semibold"
                                                )}
                                            >
                                                {route.label}
                                            </Link>
                                        </SheetClose>
                                    );
                                })}
                            </nav>
                        </SheetContent>
                    </Sheet>

                    <NavigationMenu className="hidden md:flex">
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
                </div>
                <ThemeSwitcher />
            </div>
        </header>
    );
}
