import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HeaderProps = {
  title: string;
  highlight?: string;
};

export default function Header({ title, highlight }: HeaderProps) {
  return (
    <header className="fixed top-0 right-0 left-16 lg:left-64 z-10 h-16 glass-effect border-b border-white/5 px-4 flex items-center justify-between">
      <div>
        <h2 className="font-orbitron text-lg md:text-xl">
          {title} {highlight && <span className="text-cyan-400">{highlight}</span>}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="hidden md:block relative">
          <Input 
            type="text" 
            placeholder="Search..." 
            className="bg-[#0A0A10]/70 border border-cyan-400/30 rounded-lg py-2 pl-10 pr-4 w-64 focus:outline-none focus:border-cyan-400/80 text-sm transition-all" 
          />
          <i className="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
        </div>
        
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-white/5 transition-all">
          <i className="ri-notification-3-line text-xl"></i>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500"></span>
        </button>
        
        {/* Connect Wallet Button */}
        <Button 
          className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white"
        >
          <i className="ri-wallet-3-line mr-2"></i>
          <span>Connect Wallet</span>
        </Button>
      </div>
    </header>
  );
}
