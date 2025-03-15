import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

type SidebarItemProps = {
  href: string;
  icon: string; 
  label: string;
  isActive?: boolean;
};

const SidebarItem = ({ href, icon, label, isActive }: SidebarItemProps) => {
  return (
    <li>
      <div 
        className={cn(
          "flex items-center justify-center lg:justify-start p-2 lg:p-3 rounded-lg transition-all cursor-pointer",
          isActive
            ? "text-white bg-cyan-400/20 group"
            : "text-gray-400 hover:text-white hover:bg-white/5 group"
        )}
        onClick={() => window.location.href = href}
      >
        <i className={cn(
          icon, 
          "text-xl lg:mr-3",
          isActive 
            ? "text-cyan-400" 
            : "group-hover:text-purple-500"
        )}></i>
        <span className="hidden lg:block font-medium">{label}</span>
        {isActive && (
          <span className="hidden lg:block ml-auto h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
        )}
      </div>
    </li>
  );
};

export default function Sidebar() {
  const [location] = useLocation();
  
  return (
    <aside className="fixed top-0 left-0 bottom-0 z-20 w-16 lg:w-64 bg-[#191A2A] border-r border-cyan-400/20 transition-all duration-300 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-4 flex items-center justify-center lg:justify-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center glow-border animate-glow">
              <span className="font-orbitron font-bold text-white text-xl">SM</span>
            </div>
          </div>
          <h1 className="hidden lg:block font-orbitron font-bold text-xl ml-3 cybr-text-gradient">SmartMoney AI</h1>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 mt-8">
          <ul className="space-y-2 px-2">
            <SidebarItem 
              href="/" 
              icon="ri-dashboard-3-line" 
              label="Dashboard" 
              isActive={location === "/"} 
            />
            <SidebarItem 
              href="/whale-tracker" 
              icon="ri-funds-line" 
              label="Whale Tracker" 
              isActive={location === "/whale-tracker"} 
            />
            <SidebarItem 
              href="/ai-trends" 
              icon="ri-brain-line" 
              label="AI Trends" 
              isActive={location === "/ai-trends"} 
            />
            <SidebarItem 
              href="/ai-assistant" 
              icon="ri-robot-line" 
              label="AI Assistant" 
              isActive={location === "/ai-assistant"} 
            />
            <SidebarItem 
              href="/wallet-insights" 
              icon="ri-wallet-3-line" 
              label="Wallet Insights" 
              isActive={location === "/wallet-insights"} 
            />
            <SidebarItem 
              href="/alerts" 
              icon="ri-notification-3-line" 
              label="Alerts" 
              isActive={location === "/alerts"} 
            />
          </ul>
        </nav>
        
        {/* User Profile */}
        <div className="mt-auto mb-4 px-2">
          <div className="hidden lg:flex items-center p-3 rounded-lg bg-[#0A0A10]/50 glow-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
              <span className="text-xs font-bold">HP</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Harsh Patil</p>
              <p className="text-xs text-gray-400">Pro Member</p>
            </div>
            <button className="ml-auto text-gray-400 hover:text-white">
              <i className="ri-settings-3-line"></i>
            </button>
          </div>
          <div className="lg:hidden flex justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
              <span className="text-xs font-bold">JP</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
