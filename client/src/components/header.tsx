import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type HeaderProps = {
  title: string;
  highlight?: string;
};

export default function Header({ title, highlight }: HeaderProps) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { toast } = useToast();
  
  // Sample notifications
  const notifications = [
    {
      id: 1, 
      title: "Large BTC Transfer Detected", 
      description: "245 BTC transferred to exchange wallet",
      time: "2 min ago",
      read: false
    },
    {
      id: 2, 
      title: "Whale Wallet Alert", 
      description: "Wallet 0x7a25...1fe2 active after 3 months",
      time: "15 min ago",
      read: false
    },
    {
      id: 3, 
      title: "AI Prediction Update", 
      description: "New signal: ETH accumulation detected",
      time: "1 hour ago",
      read: true
    }
  ];
  
  const [selectedWalletType, setSelectedWalletType] = useState<string | null>(null);
  const [customWalletAddress, setCustomWalletAddress] = useState("");
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  
  const initiateWalletConnection = (walletType: string) => {
    setSelectedWalletType(walletType);
    setShowAddressDialog(true);
  };
  
  const connectWallet = () => {
    if (!customWalletAddress) {
      toast({
        title: "Input Required",
        description: "Please enter a wallet address",
        variant: "destructive"
      });
      return;
    }
    
    setIsConnecting(true);
    // Simulate wallet connection
    setTimeout(() => {
      // Format the address for display (first 6 chars + ... + last 4 chars)
      const formattedAddress = customWalletAddress.length > 10 
        ? `${customWalletAddress.substring(0, 6)}...${customWalletAddress.substring(customWalletAddress.length - 4)}`
        : customWalletAddress;
        
      setWalletAddress(formattedAddress);
      setWalletConnected(true);
      setIsConnecting(false);
      setShowAddressDialog(false);
      setShowConnectDialog(false);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${formattedAddress}`,
        variant: "default"
      });
    }, 1500);
  };
  
  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
      variant: "default"
    });
  };
  
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
        <div className="relative">
          <button 
            className="relative p-2 rounded-lg hover:bg-white/5 transition-all"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <i className="ri-notification-3-line text-xl"></i>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500"></span>
          </button>
          
          {/* Notifications Panel */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#191A2A] border border-white/10 rounded-lg shadow-lg p-2 z-50">
              <div className="flex items-center justify-between p-2 border-b border-white/10">
                <h3 className="font-medium">Notifications</h3>
                <span className="text-xs text-cyan-400">{notifications.filter(n => !n.read).length} unread</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-2 hover:bg-white/5 rounded-lg my-1 ${!notification.read ? 'border-l-2 border-cyan-400' : ''} transition-all cursor-pointer`}
                  >
                    <div className="flex items-start">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!notification.read ? 'bg-cyan-400/20 text-cyan-400' : 'bg-white/10 text-gray-400'}`}>
                        <i className="ri-notification-3-line"></i>
                      </div>
                      <div className="ml-2">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <p className="text-xs text-gray-400">{notification.description}</p>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-white/10 text-center">
                <button className="text-sm text-cyan-400 hover:underline">View all notifications</button>
              </div>
            </div>
          )}
        </div>
        
        {/* Connect Wallet Button */}
        {walletConnected ? (
          <Button 
            className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-green-400 to-cyan-500 text-white"
            onClick={() => disconnectWallet()}
          >
            <i className="ri-wallet-3-line mr-2"></i>
            <span className="font-mono text-sm">{walletAddress}</span>
          </Button>
        ) : (
          <Button 
            className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white"
            onClick={() => setShowConnectDialog(true)}
          >
            <i className="ri-wallet-3-line mr-2"></i>
            <span>Connect Wallet</span>
          </Button>
        )}
      </div>
      
      {/* Connect Wallet Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="bg-[#191A2A] border border-cyan-400/20 text-white">
          <DialogHeader>
            <DialogTitle>Connect Your Wallet</DialogTitle>
            <DialogDescription className="text-gray-400">
              Connect your crypto wallet to access all features of Smart Money Tracker AI
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-cyan-400/20 hover:border-cyan-400/60 bg-[#0A0A10]/70 hover:bg-[#0A0A10] transition-all cursor-pointer"
              onClick={() => initiateWalletConnection("MetaMask")}
            >
              <div className="w-12 h-12 rounded-full bg-cyan-400/20 flex items-center justify-center mb-2">
                <i className="ri-firefox-line text-2xl text-cyan-400"></i>
              </div>
              <span className="font-medium">MetaMask</span>
            </div>
            
            <div
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/60 bg-[#0A0A10]/70 hover:bg-[#0A0A10] transition-all cursor-pointer"
              onClick={() => initiateWalletConnection("Coinbase")}
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                <i className="ri-compass-3-line text-2xl text-purple-500"></i>
              </div>
              <span className="font-medium">Coinbase</span>
            </div>
            
            <div
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-pink-500/20 hover:border-pink-500/60 bg-[#0A0A10]/70 hover:bg-[#0A0A10] transition-all cursor-pointer"
              onClick={() => initiateWalletConnection("WalletConnect")}
            >
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-2">
                <i className="ri-treasure-map-line text-2xl text-pink-500"></i>
              </div>
              <span className="font-medium">WalletConnect</span>
            </div>
            
            <div
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-green-400/20 hover:border-green-400/60 bg-[#0A0A10]/70 hover:bg-[#0A0A10] transition-all cursor-pointer"
              onClick={() => initiateWalletConnection("Trust Wallet")}
            >
              <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center mb-2">
                <i className="ri-bit-coin-line text-2xl text-green-400"></i>
              </div>
              <span className="font-medium">Trust Wallet</span>
            </div>
          </div>
          
          <DialogFooter>
            {isConnecting ? (
              <Button disabled className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                Connecting...
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setShowConnectDialog(false)}
                className="border-cyan-400/30 text-white hover:bg-white/5"
              >
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Wallet Address Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="bg-[#191A2A] border border-cyan-400/20 text-white">
          <DialogHeader>
            <DialogTitle>{selectedWalletType} Wallet</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter your wallet address to connect and track your assets
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm text-gray-300 mb-2 block">Wallet Address</label>
            <Input 
              type="text" 
              placeholder="Enter wallet address (0x...)" 
              className="bg-[#0A0A10] border border-cyan-400/30 rounded-lg py-2 px-4 w-full text-white focus:outline-none focus:border-cyan-400/80 text-sm transition-all"
              value={customWalletAddress}
              onChange={(e) => setCustomWalletAddress(e.target.value)}
            />
            <p className="text-xs text-cyan-400/70 mt-2">
              <i className="ri-information-line mr-1"></i>
              Your wallet address will be used to track your assets and provide personalized insights
            </p>
          </div>
          
          <DialogFooter>
            {isConnecting ? (
              <Button disabled className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                Connecting...
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddressDialog(false);
                    setCustomWalletAddress("");
                  }}
                  className="border-cyan-400/30 text-white hover:bg-white/5 mr-2"
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white"
                  onClick={connectWallet}
                >
                  Connect
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
