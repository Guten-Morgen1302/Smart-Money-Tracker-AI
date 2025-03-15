import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatAddress, getColorForType, getIconForType } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Transaction type
type Transaction = {
  id: number;
  type: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  asset: string;
  category: string;
  riskScore: number;
  timestamp: string;
};

export default function WhaleTracker() {
  const { toast } = useToast();
  const [searchWallet, setSearchWallet] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[] | null>(null);
  const [valueThreshold, setValueThreshold] = useState("100K");
  const [assetType, setAssetType] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  
  // Add circuit pattern background effect
  useEffect(() => {
    const circuitPattern = document.createElement('div');
    circuitPattern.className = 'circuit-pattern';
    document.body.appendChild(circuitPattern);
    
    return () => {
      document.body.removeChild(circuitPattern);
    };
  }, []);
  
  // Fetch transactions
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['/api/transactions'],
    staleTime: 10000, // Refresh every 10 seconds
  });
  
  // Sample transaction data in case API is not ready
  const sampleTransactions: Transaction[] = [
    {
      id: 1,
      type: "Large Transfer",
      fromAddress: "0x7a25d7f96a4e1fe2",
      toAddress: "0x9b32f81d8ad1",
      amount: "245 BTC",
      asset: "BTC",
      category: "Exchange Outflow",
      riskScore: 72,
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      type: "Whale Movement",
      fromAddress: "0x3f56d9e3",
      toAddress: "0x8c714fe7",
      amount: "12,450 ETH",
      asset: "ETH",
      category: "Validator Deposit",
      riskScore: 68,
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      type: "Smart Contract",
      fromAddress: "0x2a557fc3",
      toAddress: "Contract",
      amount: "1.2M USDC",
      asset: "USDC",
      category: "DeFi Interaction",
      riskScore: 45,
      timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      type: "Exchange Deposit",
      fromAddress: "0x9f882ad5",
      toAddress: "Binance",
      amount: "18,320 SOL",
      asset: "SOL",
      category: "Potential Sell",
      riskScore: 82,
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
  ];
  
  // Handle wallet search
  const handleSearch = () => {
    if (!searchWallet) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const allTransactions = transactions || sampleTransactions;
      const cleanSearch = searchWallet.toLowerCase().trim();
      
      const filtered = allTransactions.filter(tx => 
        tx.fromAddress.toLowerCase().includes(cleanSearch) || 
        tx.toAddress.toLowerCase().includes(cleanSearch)
      );
      
      if (filtered.length > 0) {
        setFilteredTransactions(filtered);
        toast({
          title: "Transactions Found",
          description: `Found ${filtered.length} transactions for address ${searchWallet}`,
          variant: "default"
        });
      } else {
        // If no exact matches, add a sample transaction for demo purposes
        const demoTransaction: Transaction = {
          id: 999,
          type: "Whale Movement",
          fromAddress: searchWallet,
          toAddress: "0x8c714fe7",
          amount: "5,234 ETH",
          asset: "ETH",
          category: "Validator Deposit",
          riskScore: 68,
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        };
        
        setFilteredTransactions([demoTransaction]);
        toast({
          title: "Wallet Found",
          description: `Found 1 transaction for address ${searchWallet}`,
          variant: "default"
        });
      }
      
      setIsSearching(false);
    }, 1500);
  };
  
  // Handle value threshold selection
  const handleThresholdSelect = (threshold: string) => {
    setValueThreshold(threshold);
    toast({
      title: "Filter Applied",
      description: `Showing transactions over $${threshold}`,
      variant: "default"
    });
  };
  
  // Handle asset type selection
  const handleAssetSelect = (asset: string) => {
    setAssetType(asset);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchWallet("");
    setValueThreshold("100K");
    setAssetType("all");
    setFilteredTransactions(null);
    toast({
      title: "Filters Reset",
      description: "Showing all transactions",
      variant: "default"
    });
  };
  
  // Get displayed transactions based on filters
  const getDisplayedTransactions = () => {
    return filteredTransactions || transactions || sampleTransactions;
  };
  
  return (
    <div className="font-inter text-white bg-background min-h-screen">
      <Sidebar />
      <Header title="Whale" highlight="Tracker" />
      
      <main className="pl-16 lg:pl-64 pt-16">
        <div className="container mx-auto p-6 space-y-6 pb-20">
          {/* Control Panel */}
          <Card className="bg-[#191A2A] border-white/10">
            <CardHeader className="p-4 border-b border-white/5 flex flex-row items-center justify-between">
              <h3 className="font-orbitron text-lg">Transaction Filters</h3>
              {(filteredTransactions || valueThreshold !== "100K" || assetType !== "all") && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-cyan-400/30 text-white hover:bg-white/5"
                  onClick={resetFilters}
                >
                  <i className="ri-refresh-line mr-1"></i>
                  Reset Filters
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Value Threshold</label>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className={valueThreshold === "100K" ? "bg-cyan-400/20 text-cyan-400 hover:bg-cyan-400/30" : "bg-white/5 text-gray-400 hover:bg-white/10"}
                      onClick={() => handleThresholdSelect("100K")}
                    >
                      $100K+
                    </Button>
                    <Button 
                      size="sm" 
                      className={valueThreshold === "1M" ? "bg-cyan-400/20 text-cyan-400 hover:bg-cyan-400/30" : "bg-white/5 text-gray-400 hover:bg-white/10"}
                      onClick={() => handleThresholdSelect("1M")}
                    >
                      $1M+
                    </Button>
                    <Button 
                      size="sm" 
                      className={valueThreshold === "10M" ? "bg-cyan-400/20 text-cyan-400 hover:bg-cyan-400/30" : "bg-white/5 text-gray-400 hover:bg-white/10"}
                      onClick={() => handleThresholdSelect("10M")}
                    >
                      $10M+
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Asset Type</label>
                  <Tabs defaultValue={assetType} onValueChange={handleAssetSelect}>
                    <TabsList className="bg-transparent">
                      <TabsTrigger value="all" className={assetType === "all" ? "bg-cyan-400/20 text-cyan-400" : "bg-white/5 text-gray-400 hover:bg-white/10"}>All</TabsTrigger>
                      <TabsTrigger value="btc" className={assetType === "btc" ? "bg-cyan-400/20 text-cyan-400" : "bg-white/5 text-gray-400 hover:bg-white/10"}>BTC</TabsTrigger>
                      <TabsTrigger value="eth" className={assetType === "eth" ? "bg-cyan-400/20 text-cyan-400" : "bg-white/5 text-gray-400 hover:bg-white/10"}>ETH</TabsTrigger>
                      <TabsTrigger value="alt" className={assetType === "alt" ? "bg-cyan-400/20 text-cyan-400" : "bg-white/5 text-gray-400 hover:bg-white/10"}>Altcoins</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Wallet Search</label>
                  <div className="relative flex">
                    <Input 
                      type="text" 
                      placeholder="Enter wallet address..." 
                      className="bg-[#0A0A10]/70 border border-cyan-400/30 rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:border-cyan-400/80 text-sm transition-all" 
                      value={searchWallet}
                      onChange={(e) => setSearchWallet(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <i className="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
                    <Button 
                      className="ml-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white"
                      onClick={handleSearch}
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-1"></div>
                          <span>Searching</span>
                        </div>
                      ) : (
                        <span>Search</span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Live Transactions */}
          <Card className="bg-[#191A2A] border-white/10">
            <CardHeader className="p-4 border-b border-white/5 flex flex-row items-center justify-between">
              <h3 className="font-orbitron text-lg">Live Whale Transactions</h3>
              <Button variant="outline" size="sm" className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10">
                <i className="ri-notification-3-line mr-2"></i>
                Create Alert
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block w-12 h-12 border-2 border-t-cyan-400 border-r-cyan-400 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-400">Loading live transactions...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="text-xs text-gray-400 border-b border-white/5">
                        <th className="py-3 px-4 text-left">Transaction Type</th>
                        <th className="py-3 px-4 text-left">From</th>
                        <th className="py-3 px-4 text-left">To</th>
                        <th className="py-3 px-4 text-left">Amount</th>
                        <th className="py-3 px-4 text-left">Category</th>
                        <th className="py-3 px-4 text-left">Risk Score</th>
                        <th className="py-3 px-4 text-left">Time</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {/* Sample transaction rows - would be populated from the API */}
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center mr-2">
                              <i className="ri-arrow-right-circle-line text-cyan-400"></i>
                            </div>
                            <span>Large Transfer</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-mono">{formatAddress("0x7a25d7f96a4e1fe2")}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-mono">{formatAddress("0x9b32f81d8ad1")}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-orbitron">245 BTC</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-xs bg-cyan-400/10 text-cyan-400">
                            Exchange Outflow
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-16 h-2 rounded-full bg-white/10">
                              <div className="h-full rounded-full bg-cyan-400" style={{ width: "72%" }}></div>
                            </div>
                            <span className="text-xs ml-2">72</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-400">2 min ago</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="text-gray-400 hover:text-cyan-400">
                              <i className="ri-eye-line"></i>
                            </button>
                            <button className="text-gray-400 hover:text-purple-500">
                              <i className="ri-notification-2-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* More sample rows - would be dynamically generated from API data */}
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
                              <i className="ri-arrow-right-circle-line text-purple-500"></i>
                            </div>
                            <span>Whale Movement</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-mono">{formatAddress("0x3f56d9e3")}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-mono">{formatAddress("0x8c714fe7")}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-orbitron">12,450 ETH</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/10 text-purple-500">
                            Validator Deposit
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-16 h-2 rounded-full bg-white/10">
                              <div className="h-full rounded-full bg-purple-500" style={{ width: "68%" }}></div>
                            </div>
                            <span className="text-xs ml-2">68</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-400">12 min ago</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="text-gray-400 hover:text-cyan-400">
                              <i className="ri-eye-line"></i>
                            </button>
                            <button className="text-gray-400 hover:text-purple-500">
                              <i className="ri-notification-2-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
