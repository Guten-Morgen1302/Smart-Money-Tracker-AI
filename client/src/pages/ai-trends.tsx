import { useEffect } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import MarketTrendChart from "@/components/market-trend-chart";
import AIInsights from "@/components/ai-insights"; 
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AITrends() {
  // Add circuit pattern background effect
  useEffect(() => {
    const circuitPattern = document.createElement('div');
    circuitPattern.className = 'circuit-pattern';
    document.body.appendChild(circuitPattern);
    
    return () => {
      document.body.removeChild(circuitPattern);
    };
  }, []);
  
  return (
    <div className="font-inter text-white bg-background min-h-screen">
      <Sidebar />
      <Header title="AI" highlight="Trends" />
      
      <main className="pl-16 lg:pl-64 pt-16">
        <div className="container mx-auto p-6 space-y-6 pb-20">
          {/* AI Prediction Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#191A2A] border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-400 text-sm">Prediction Accuracy</h3>
                    <p className="mt-1 text-2xl font-orbitron font-bold">89%</p>
                    <p className="mt-1 text-xs text-gray-400">Based on 124 predictions</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-cyan-400/20 flex items-center justify-center">
                    <i className="ri-bar-chart-box-line text-xl text-cyan-400"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#191A2A] border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-400 text-sm">Active Signals</h3>
                    <p className="mt-1 text-2xl font-orbitron font-bold">9</p>
                    <p className="mt-1 text-xs text-gray-400">5 bullish, 4 bearish</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <i className="ri-radar-line text-xl text-purple-500"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#191A2A] border-green-400/20 hover:border-green-400/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-400 text-sm">Data Sources</h3>
                    <p className="mt-1 text-2xl font-orbitron font-bold">14</p>
                    <p className="mt-1 text-xs text-gray-400">On-chain & social data</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center">
                    <i className="ri-database-2-line text-xl text-green-400"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* AI Trend Analysis */}
          <Card className="bg-[#191A2A] border-white/10">
            <CardHeader className="p-4 border-b border-white/5">
              <h3 className="font-orbitron text-lg">AI Trend Analysis</h3>
            </CardHeader>
            <CardContent className="p-4">
              <Tabs defaultValue="market">
                <TabsList className="bg-transparent mb-4">
                  <TabsTrigger value="market" className="bg-cyan-400/20 text-cyan-400">Market Sentiment</TabsTrigger>
                  <TabsTrigger value="whales" className="bg-white/5 text-gray-400 hover:bg-white/10">Whale Behavior</TabsTrigger>
                  <TabsTrigger value="social" className="bg-white/5 text-gray-400 hover:bg-white/10">Social Signals</TabsTrigger>
                </TabsList>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <MarketTrendChart />
                  </div>
                  <AIInsights />
                </div>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* AI Prediction Timeline */}
          <Card className="bg-[#191A2A] border-white/10">
            <CardHeader className="p-4 border-b border-white/5">
              <h3 className="font-orbitron text-lg">Recent Predictions Timeline</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative border-l-2 border-white/10 ml-4 space-y-6 py-2">
                {/* Timeline items */}
                <div className="relative">
                  <div className="absolute -left-[9px] w-4 h-4 rounded-full bg-cyan-400 border-4 border-[#191A2A]"></div>
                  <div className="ml-6">
                    <div className="bg-[#0A0A10]/70 p-4 rounded-lg border border-cyan-400/20">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-cyan-400">BTC Price Movement Prediction</h4>
                        <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-green-400/10 text-green-400">Successful</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-2">AI predicted 8-12% price increase based on whale accumulation patterns and reduced exchange reserves. BTC rose 9.5% within the predicted timeframe.</p>
                      <div className="mt-2 text-xs text-gray-400 flex justify-between items-center">
                        <span>Confidence: <span className="text-cyan-400">86%</span></span>
                        <span>2023-10-15</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[9px] w-4 h-4 rounded-full bg-purple-500 border-4 border-[#191A2A]"></div>
                  <div className="ml-6">
                    <div className="bg-[#0A0A10]/70 p-4 rounded-lg border border-purple-500/20">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-purple-500">ETH DeFi Integration Surge</h4>
                        <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-gray-400/10 text-gray-400">Pending</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-2">AI detected increasing smart contract interactions on Ethereum indicating potential surge in DeFi activity. Predicted 20-30% TVL increase in major protocols.</p>
                      <div className="mt-2 text-xs text-gray-400 flex justify-between items-center">
                        <span>Confidence: <span className="text-purple-500">74%</span></span>
                        <span>2023-10-12</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[9px] w-4 h-4 rounded-full bg-pink-500 border-4 border-[#191A2A]"></div>
                  <div className="ml-6">
                    <div className="bg-[#0A0A10]/70 p-4 rounded-lg border border-pink-500/20">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-pink-500">SOL Exchange Outflows Warning</h4>
                        <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-pink-500/10 text-pink-500">Failed</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-2">AI flagged unusual SOL exchange outflows as potential bearish signal. Price moved opposite to prediction due to unexpected protocol upgrade announcement.</p>
                      <div className="mt-2 text-xs text-gray-400 flex justify-between items-center">
                        <span>Confidence: <span className="text-pink-500">62%</span></span>
                        <span>2023-10-08</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
