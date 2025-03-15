import { useEffect } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import StatsOverview from "@/components/stats-overview";
import MarketTrendChart from "@/components/market-trend-chart";
import WhaleActivity from "@/components/whale-activity";
import AIInsights from "@/components/ai-insights";
import TopWallets from "@/components/top-wallets";

export default function Dashboard() {
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
      <Header title="Dashboard" highlight="Overview" />
      
      <main className="pl-16 lg:pl-64 pt-16">
        <div className="container mx-auto p-6 space-y-6 pb-20">
          {/* Stats Overview */}
          <StatsOverview />
          
          {/* Charts and Whale Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MarketTrendChart />
            </div>
            <WhaleActivity />
          </div>
          
          {/* AI Insights and Top Wallets Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AIInsights />
            <div className="lg:col-span-2">
              <TopWallets />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
