import { Link, useLocation } from "wouter";
import { Pickaxe, Wallet, History, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Pickaxe, label: "Mine" },
    { href: "/withdraw", icon: Wallet, label: "Withdraw" },
    { href: "/history", icon: History, label: "History" },
    { href: "/referral", icon: Users, label: "Friends" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent">
      <nav className="glass-panel mx-auto max-w-md rounded-2xl flex items-center justify-around p-2 relative">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className="relative z-10 w-full">
              <div
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 cursor-pointer",
                  isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-lg shadow-primary/25"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("w-6 h-6 mb-1", isActive && "animate-pulse")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium tracking-wide uppercase">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
