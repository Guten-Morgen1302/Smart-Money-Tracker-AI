import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { formatAddress, getColorForType } from "@/lib/utils";
import TopWallets from "@/components/top-wallets";

export default function WalletInsights() {
  // Add circuit pattern background effect
  useEffect(() => {
    const circuitPattern = document.createElement('div');
    circuitPattern.className = 'circuit-pattern';
    document.body.appendChild(circuitPattern);
    
    return () => {
      document.body.removeChild(circuitPattern);
    };
  }, []);
  
  const [searchAddress, setSearchAddress] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  // Search wallet - would be connected to API
  const handleSearch = () => {
    if (searchAddress) {
      setHasSearched(true);
    }
  };
  
  return (
    <div className="font-inter text-white bg-background min-h-screen">
      <Sidebar />
      <Header title="Wallet" highlight="Insights" />
      
      <main className="pl-16 lg:pl-64 pt-16">
        <div className="container mx-auto p-6 space-y-6 pb-20">
          {/* Wallet Search */}
          <Card className="bg-[#191A2A] border-white/10">
            <CardHeader className="p-4 border-b border-white/5">
              <h3 className="font-orbitron text-lg">Wallet Analysis</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="Enter wallet address to analyze..." 
                    className="bg-[#0A0A10]/70 border border-cyan-400/30 rounded-lg py-3 pl-10 pr-24 w-full focus:outline-none focus:border-cyan-400/80 text-sm transition-all" 
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <i className="ri-search-line absolute left-3 top-3.5 text-gray-400"></i>
                  <Button 
                    className="absolute right-2 top-1.5 bg-gradient-to-r from-cyan-400 to-purple-500 text-white"
                    onClick={handleSearch}
                  >
                    Analyze
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Enter any Ethereum, Bitcoin, or Solana wallet address to get insights on its behavior and risk profile.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {hasSearched && (
            <>
              {/* Wallet Overview */}
              <Card className="bg-[#191A2A] border-white/10">
                <CardHeader className="p-4 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-orbitron text-lg">Wallet Overview</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400">Smart Money</span>
                      <Button variant="outline" size="sm" className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10">
                        <i className="ri-notification-3-line mr-1"></i> Track
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm text-gray-400 mb-2">Wallet Information</h4>
                      <div className="bg-[#0A0A10]/70 rounded-lg p-4 border border-white/5">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-cyan-400/20 flex items-center justify-center mr-3">
                            <i className="ri-wallet-3-line text-lg text-cyan-400"></i>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{searchAddress ? formatAddress(searchAddress) : "0x7a25...1fe2"}</div>
                            <div className="text-xs text-gray-400">First seen: 384 days ago</div>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-auto text-gray-400 hover:text-white">
                            <i className="ri-file-copy-line"></i>
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <div className="text-xs text-gray-400">Total Balance</div>
                            <div className="text-lg font-orbitron font-bold">$145.2M</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Active Tokens</div>
                            <div className="text-lg font-orbitron font-bold">12</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Transactions</div>
                            <div className="text-lg font-orbitron font-bold">547</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Risk Score</div>
                            <div className="text-lg font-orbitron font-bold text-cyan-400">82/100</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-400 mb-2">AI Analysis</h4>
                      <div className="bg-[#0A0A10]/70 rounded-lg p-4 border border-white/5 h-full">
                        <div className="mb-2">
                          <div className="text-sm font-medium">Behavioral Pattern</div>
                          <div className="text-xs text-gray-300 mt-1">
                            This wallet exhibits traits of an experienced institutional investor. Transaction patterns suggest systematic accumulation during market dips with minimal selling during uptrends.
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <div className="text-sm font-medium">Prediction</div>
                          <div className="text-xs text-green-400 mt-1">
                            <i className="ri-arrow-up-line mr-1"></i> Bullish (86% confidence)
                          </div>
                        </div>
                        
                        <div className="mt-3 text-xs text-gray-400">
                          <span className="flex items-center"><i className="ri-information-line mr-1"></i> This wallet has correctly predicted market direction in 8 of last 10 significant moves</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Top Tokens & Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#191A2A] border-white/10">
                  <CardHeader className="p-4 border-b border-white/5">
                    <h3 className="font-orbitron text-lg">Top Tokens</h3>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-xs text-gray-400 border-b border-white/5">
                            <th className="py-3 px-4 text-left">Token</th>
                            <th className="py-3 px-4 text-left">Amount</th>
                            <th className="py-3 px-4 text-left">Value</th>
                            <th className="py-3 px-4 text-left">% of Portfolio</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center mr-2">
                                  <span className="text-xs font-bold text-cyan-400">BTC</span>
                                </div>
                                <span>Bitcoin</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono">1,245 BTC</td>
                            <td className="py-3 px-4 font-orbitron">$60.2M</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-24 h-2 rounded-full bg-white/10">
                                  <div className="h-full rounded-full bg-cyan-400" style={{ width: "42%" }}></div>
                                </div>
                                <span className="text-xs ml-2">42%</span>
                              </div>
                            </td>
                          </tr>
                          
                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
                                  <span className="text-xs font-bold text-purple-500">ETH</span>
                                </div>
                                <span>Ethereum</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono">18,320 ETH</td>
                            <td className="py-3 px-4 font-orbitron">$52.5M</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-24 h-2 rounded-full bg-white/10">
                                  <div className="h-full rounded-full bg-purple-500" style={{ width: "36%" }}></div>
                                </div>
                                <span className="text-xs ml-2">36%</span>
                              </div>
                            </td>
                          </tr>
                          
                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center mr-2">
                                  <span className="text-xs font-bold text-green-400">SOL</span>
                                </div>
                                <span>Solana</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono">241,500 SOL</td>
                            <td className="py-3 px-4 font-orbitron">$32.1M</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-24 h-2 rounded-full bg-white/10">
                                  <div className="h-full rounded-full bg-green-400" style={{ width: "22%" }}></div>
                                </div>
                                <span className="text-xs ml-2">22%</span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#191A2A] border-white/10">
                  <CardHeader className="p-4 border-b border-white/5">
                    <h3 className="font-orbitron text-lg">Recent Transactions</h3>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-xs text-gray-400 border-b border-white/5">
                            <th className="py-3 px-4 text-left">Type</th>
                            <th className="py-3 px-4 text-left">Amount</th>
                            <th className="py-3 px-4 text-left">Time</th>
                            <th className="py-3 px-4 text-left">AI Insight</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-xs bg-cyan-400/10 text-cyan-400">Buy</span>
                            </td>
                            <td className="py-3 px-4 font-mono">120 BTC</td>
                            <td className="py-3 px-4 text-sm text-gray-400">2 hours ago</td>
                            <td className="py-3 px-4 text-xs">
                              <span className="text-green-400">Accumulation during market dip</span>
                            </td>
                          </tr>
                          
                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/10 text-purple-500">Swap</span>
                            </td>
                            <td className="py-3 px-4 font-mono">5,000 ETH → 150,000 SOL</td>
                            <td className="py-3 px-4 text-sm text-gray-400">1 day ago</td>
                            <td className="py-3 px-4 text-xs">
                              <span className="text-cyan-400">Rotating to stronger performing asset</span>
                            </td>
                          </tr>
                          
                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-xs bg-pink-500/10 text-pink-500">Sell</span>
                            </td>
                            <td className="py-3 px-4 font-mono">20,000 LINK</td>
                            <td className="py-3 px-4 text-sm text-gray-400">3 days ago</td>
                            <td className="py-3 px-4 text-xs">
                              <span className="text-pink-500">Taking profits at local top</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Similar Wallets */}
              <div>
                <h3 className="font-orbitron text-lg mb-4">Similar Whale Wallets</h3>
                <TopWallets />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
