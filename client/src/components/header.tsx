import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"; 
import { useToast } from "@/hooks/use-toast";

type HeaderProps = {
  title: string;
  highlight?: string;
};

// Type for the wallet detection result
type WalletDetectionResult = {
  isValid: boolean;
  walletType: string;
};

export default function Header({ title, highlight }: HeaderProps) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [connectedWalletType, setConnectedWalletType] = useState("");
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

  const [customWalletAddress, setCustomWalletAddress] = useState("");

  // Validate cryptocurrency addresses
  const detectWalletType = (address: string): WalletDetectionResult => {
    // Ethereum-based address (ETH, ERC-20 tokens, etc.)
    if (/^0x[a-fA-F0-9]{40}$/i.test(address)) {
      return { isValid: true, walletType: "Ethereum" };
    }

    // Bitcoin address (improved validation)
    if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$|^(bc1)[a-zA-HJ-NP-Z0-9]{39,59}$/i.test(address)) {
      return { isValid: true, walletType: "Bitcoin" };
    }

    // Litecoin address
    if (/^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/i.test(address)) {
      return { isValid: true, walletType: "Litecoin" };
    }

    // Cardano address
    if (/^addr1[a-zA-Z0-9]{98}$|^DdzFF[a-zA-Z0-9]{94}$/i.test(address)) {
      return { isValid: true, walletType: "Cardano" };
    }

    // Solana address
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/i.test(address) || /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{32,44}$/i.test(address)) {
      return { isValid: true, walletType: "Solana" };
    }

    // Invalid address
    return { isValid: false, walletType: "Unknown" };
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

    // Validate wallet address format
    const detectionResult = detectWalletType(customWalletAddress);

    if (!detectionResult.isValid) {
      toast({
        title: "Invalid Wallet Address",
        description: "Please enter a valid cryptocurrency wallet address",
        variant: "destructive"
      });
      return;
    }

    // Save the detected wallet type
    setConnectedWalletType(detectionResult.walletType);
    setIsConnecting(true);

    // Simulate wallet connection
    setTimeout(() => {
      // Format the address for display (first 6 chars + ... + last 4 chars)
      const formattedAddress = `${customWalletAddress.substring(0, 6)}...${customWalletAddress.substring(customWalletAddress.length - 4)}`;

      setWalletAddress(formattedAddress);
      setWalletConnected(true);
      setIsConnecting(false);
      setShowConnectDialog(false);

      toast({
        title: `${detectionResult.walletType} Wallet Connected`,
        description: `Successfully connected to ${detectionResult.walletType} wallet ${formattedAddress}`,
        variant: "default"
      });
    }, 1500);
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    setConnectedWalletType("");

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
            {connectedWalletType === "Bitcoin" && <i className="ri-bitcoin-line mr-2"></i>}
            {connectedWalletType === "Ethereum" && <i className="ri-ethereum-line mr-2"></i>}
            {connectedWalletType === "Litecoin" && <i className="ri-copper-coin-line mr-2"></i>}
            {connectedWalletType === "Solana" && <i className="ri-sun-line mr-2"></i>}
            {connectedWalletType === "Cardano" && <i className="ri-sailing-boat-line mr-2"></i>}
            {(connectedWalletType === "Unknown" || !connectedWalletType) && <i className="ri-wallet-3-line mr-2"></i>}
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
          {/* Added username display */}
          <span className="text-white">{localStorage.getItem('username') || 'Guest'}</span>

      </div>

      {/* Connect Wallet Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="bg-[#191A2A] border border-cyan-400/20 text-white">
          <DialogHeader>
            <DialogTitle>Connect Your Wallet</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter your wallet address to connect and track your assets
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex flex-col space-y-4">
              {/* Supported wallet types */}
              <p className="text-sm text-cyan-400/80">Supported cryptocurrencies:</p>
              <div className="grid grid-cols-5 gap-2">
                <div className="flex flex-col items-center justify-center p-2 rounded-lg border border-cyan-400/20 bg-[#0A0A10]/70">
                  <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center">
                    <i className="ri-currency-line text-lg text-cyan-400"></i>
                  </div>
                  <span className="text-xs mt-1">ETH</span>
                </div>

                <div className="flex flex-col items-center justify-center p-2 rounded-lg border border-orange-400/20 bg-[#0A0A10]/70">
                  <div className="w-8 h-8 rounded-full bg-orange-400/20 flex items-center justify-center">
                    <i className="ri-coin-line text-lg text-orange-400"></i>
                  </div>
                  <span className="text-xs mt-1">BTC</span>
                </div>

                <div className="flex flex-col items-center justify-center p-2 rounded-lg border border-purple-400/20 bg-[#0A0A10]/70">
                  <div className="w-8 h-8 rounded-full bg-purple-400/20 flex items-center justify-center">
                    <i className="ri-coins-line text-lg text-purple-400"></i>
                  </div>
                  <span className="text-xs mt-1">ADA</span>
                </div>

                <div className="flex flex-col items-center justify-center p-2 rounded-lg border border-blue-400/20 bg-[#0A0A10]/70">
                  <div className="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center">
                    <i className="ri-bit-coin-line text-lg text-blue-400"></i>
                  </div>
                  <span className="text-xs mt-1">LTC</span>
                </div>

                <div className="flex flex-col items-center justify-center p-2 rounded-lg border border-green-400/20 bg-[#0A0A10]/70">
                  <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center">
                    <i className="ri-money-dollar-circle-line text-lg text-green-400"></i>
                  </div>
                  <span className="text-xs mt-1">SOL</span>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm text-gray-300 mb-2 block">Wallet Address</label>
                <Input 
                  type="text" 
                  placeholder="Enter any cryptocurrency wallet address" 
                  className="bg-[#0A0A10] border border-cyan-400/30 rounded-lg py-2 px-4 w-full text-white focus:outline-none focus:border-cyan-400/80 text-sm transition-all"
                  value={customWalletAddress}
                  onChange={(e) => setCustomWalletAddress(e.target.value)}
                />
                <p className="text-xs text-cyan-400/70 mt-2">
                  <i className="ri-information-line mr-1"></i>
                  We'll automatically detect the wallet type from your address
                </p>
              </div>

              <div className="bg-[#0A0A10] rounded-lg p-3 border border-white/5">
                <h4 className="text-sm font-medium text-gray-300 mb-1">Supported Wallet Types:</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li><i className="ri-checkbox-circle-line text-cyan-400 mr-1"></i> Ethereum (ETH): starts with 0x...</li>
                  <li><i className="ri-checkbox-circle-line text-cyan-400 mr-1"></i> Bitcoin (BTC): starts with 1, 3, or bc1...</li>
                  <li><i className="ri-checkbox-circle-line text-cyan-400 mr-1"></i> Litecoin (LTC): starts with L or M...</li>
                  <li><i className="ri-checkbox-circle-line text-cyan-400 mr-1"></i> Cardano (ADA): starts with addr1...</li>
                  <li><i className="ri-checkbox-circle-line text-cyan-400 mr-1"></i> Solana (SOL): 32-44 alphanumeric characters</li>
                </ul>
              </div>
            </div>
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
                    setShowConnectDialog(false);
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
