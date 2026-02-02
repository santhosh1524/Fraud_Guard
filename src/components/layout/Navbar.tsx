import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Menu,
  X,
  LogIn,
  Rocket,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// shadcn dropdown imports
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const { user, isLoading, signOut } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transactions", path: "/transactions" },
    { name: "Predict", path: "/predict" },
    { name: "Explainability", path: "/explainability" },
    { name: "About", path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg gradient-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">
              FraudGuard AI
            </span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE (DESKTOP) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Prevent flicker */}
            {isLoading && null}

            {/* BEFORE LOGIN */}
            {!isLoading && !user && (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" /> 
                  </Button>
                </Link>

                
              </>
            )}

            {/* AFTER LOGIN — PROFILE DROPDOWN */}
            {!isLoading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled className="text-sm">
                    {user.email}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-destructive cursor-pointer"
                  >
                   <LogIn className="h-5 w-5 " /><p className="pl-5">Logout</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* MOBILE CTA / LOGOUT */}
              {!isLoading && !user && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/dashboard" className="flex-1">
                    <Button variant="accent" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {!isLoading && user && (
                <Button
                  variant="ghost"
                  className="mt-4"
                  onClick={signOut}
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
