"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  Github,
  MailIcon,
  Package,
  Component,
  Languages,
  Sun,
  Moon,
  Home,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";

const DOCK_DATA = [
  {
    title: "Inicio",
    icon: Home,
    href: "/",
  },
  {
    title: "Tecnologías",
    icon: Package,
    href: "#skills",
  },
  {
    title: "Proyectos",
    icon: Component,
    href: "#projects",
  },
  {
    title: "Nuestro blog",
    icon: Component,
    href: "/lista-blogs",
  },
];

const DOCK_SOCIAL_DATA = [
  {
    icon: Github,
    href: "https://github.com/cisneros14",
    label: "GitHub",
  },
  {
    icon: MailIcon,
    href: "mailto:cisnerosgranda14@gmail.com",
    label: "Correo Electronico",
  },
  {
    icon: FaWhatsapp,
    href: "https://wa.me/593939595776",
    label: "WhatsApp",
  },
];

const Nav = () => {
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLocale =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1]
      : "es";

  const handleLanguageSwitch = () => {
    const newLocale = currentLocale === "es" ? "en" : "es";
    const restPath = window.location.pathname.split("/").slice(2).join("/");
    router.push(`/${newLocale}${restPath ? "/" + restPath : ""}`);
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  if (!mounted) return null;

  return (
    <nav className="bg-white dark:bg-background backdrop-blur-md fixed w-full z-[10000] top-0 start-0 border-b border-border">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            className="w-24"
            src={theme === "dark" ? "/logo4.png" : "/logo7.png"}
            alt="Logo"
            width={1000}
            height={1000}
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        <div className="flex md:order-2 space-x-2 rtl:space-x-reverse items-center">
          {/* Social Links - Visible on desktop */}
          <div className="hidden md:flex items-center space-x-2 mr-2">
            {DOCK_SOCIAL_DATA.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={item.label}
              >
                <item.icon className="w-5 h-5" />
              </a>
            ))}
            <div className="w-[1px] h-6 bg-border mx-2"></div>
          </div>

          {/* Language Switch */}
          <button
            onClick={handleLanguageSwitch}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent"
            aria-label="Switch Language"
          >
            <Languages className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-muted-foreground rounded-lg md:hidden hover:bg-accent focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isMenuOpen ? "block" : "hidden"
          }`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-border rounded-lg bg-card md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
            {DOCK_DATA.map((item, idx) => (
              <li key={idx}>
                <Link
                  href={item.href}
                  className="block py-2 px-3 text-foreground rounded hover:bg-accent md:hover:bg-transparent md:hover:text-primary md:p-0 transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4 md:hidden" />
                  {item.title}
                </Link>
              </li>
            ))}
            {/* Social Links - Visible on mobile menu */}
            <li className="md:hidden mt-4 pt-4 border-t border-border">
              <div className="flex justify-center space-x-4">
                {DOCK_SOCIAL_DATA.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <item.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Nav;
