"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function ThemeToggle({ className, children }: { className?: string; children?: React.ReactNode }) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <Button
      type="button"
      tabIndex={0}
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      className={`fixed top-4 border dark:border-white/20 border-gray-200 bg-white dark:bg-black right-4 z-50 cursor-pointer flex items-center justify-center gap-3 rounded-md p-3 transition-colors ${className || ""}`}
      style={{ pointerEvents: "auto" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.div
            key="sun"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-5 w-5 text-blue-400 fill-blue-400" />
          </motion.div>
        )}
      </AnimatePresence>
      {children && (
        <span className="text-sm text-muted-foreground">{children}</span>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
} 