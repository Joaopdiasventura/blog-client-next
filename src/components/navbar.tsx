import Link from "next/link";
import { Home, Moon, Sun, PenSquare, LogOut } from "lucide-react";
import { useAuth } from "../contexts/auth";
import { useTheme } from "../contexts/theme";
import { Button } from "./ui/button";

export function Navbar() {
  const { user, logout } = useAuth();
  const { toggleTheme } = useTheme();

  return (
    <nav className="border-b bg-[var(--background)] dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Home className="w-5 h-5" />
            <span>{user ? `Olá, ${user.name}` : "Blog"}</span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href="/create" className="inline-flex items-center gap-2">
                  <Button variant="default" size="sm">
                    <PenSquare className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Novo Post</span>
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </>
            ) : (
              <Link href="/login" className="inline-flex items-center gap-2">
                <span className="sm:inline">Entrar</span>
              </Link>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
              title="Alternar tema"
              aria-label="Alternar tema"
            >
              <Sun className="w-4 h-4 hidden dark:inline" aria-hidden="true" />
              <Moon className="w-4 h-4 inline dark:hidden" aria-hidden="true" />
              <span className="sr-only">Alternar tema</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
