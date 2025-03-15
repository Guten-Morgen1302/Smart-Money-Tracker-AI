import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Chart from "chart.js/auto";
 
export default function MarketTrendChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1W");
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  
  // Sample data for the chart
  const chartData = {
    BTC: {
      labels: Array(24).fill(''),
      data: [39500, 39800, 40200, 40100, 39900, 39700, 39800, 40200, 40500, 40700, 41000, 41200, 41300, 41100, 41400, 41800, 42100, 42300, 42400, 42100, 42300, 42400, 42300, 42384],
      currentPrice: "$42,384.52",
      change: "+$1,245.23",
      percentChange: "+3.2%"
    },
    ETH: {
      labels: Array(24).fill(''),
      data: [2800, 2750, 2790, 2820, 2780, 2760, 2800, 2850, 2900, 2950, 2980, 3050, 3100, 3080, 3120, 3150, 3180, 3190, 3200, 3180, 3210, 3230, 3250, 3240],
      currentPrice: "$3,240.18",
      change: "+$440.18",
      percentChange: "+15.7%"
    },
    SOL: {
      labels: Array(24).fill(''),
      data: [105, 102, 104, 106, 103, 101, 104, 108, 110, 112, 114, 116, 118, 119, 117, 120, 122, 124, 123, 125, 128, 130, 131, 132],
      currentPrice: "$132.75",
      change: "+$27.75",
      percentChange: "+26.4%"
    }
  };
  
  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }
      
      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        // Create gradient fill
        const gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
        gradientFill.addColorStop(0, 'rgba(0, 229, 255, 0.3)');
        gradientFill.addColorStop(1, 'rgba(0, 229, 255, 0)');
        
        const newChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartData[selectedCoin as keyof typeof chartData].labels,
            datasets: [{
              label: `${selectedCoin} Price`,
              data: chartData[selectedCoin as keyof typeof chartData].data,
              borderColor: '#00E5FF',
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.4,
              fill: true,
              backgroundColor: gradientFill
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(13, 14, 25, 0.9)',
                titleColor: '#00E5FF',
                bodyColor: '#fff',
                borderColor: '#00E5FF',
                borderWidth: 1
              }
            },
            scales: {
              x: {
                grid: {
                  display: false,
                  drawBorder: false
                },
                ticks: {
                  display: false
                }
              },
              y: {
                position: 'right',
                grid: {
                  color: 'rgba(255, 255, 255, 0.05)',
                  drawBorder: false
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.5)',
                  padding: 10,
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            }
          }
        });
        
        setChartInstance(newChartInstance);
      }
    }
  }, [selectedCoin]);
  
  return (
    <Card className="bg-[#191A2A] border-white/10">
      <CardHeader className="border-b border-white/5 p-4 flex flex-row items-center justify-between">
        <h3 className="font-orbitron text-lg">Market Trend Analysis</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant={selectedCoin === "BTC" ? "secondary" : "ghost"} 
            size="sm" 
            className={selectedCoin === "BTC" ? "bg-cyan-400/20 text-cyan-400 hover:bg-cyan-400/30" : "bg-white/5 text-gray-400 hover:bg-white/10"}
            onClick={() => setSelectedCoin("BTC")}
          >
            BTC
          </Button>
          <Button 
            variant={selectedCoin === "ETH" ? "secondary" : "ghost"} 
            size="sm" 
            className={selectedCoin === "ETH" ? "bg-cyan-400/20 text-cyan-400 hover:bg-cyan-400/30" : "bg-white/5 text-gray-400 hover:bg-white/10"}
            onClick={() => setSelectedCoin("ETH")}
          >
            ETH
          </Button>
          <Button 
            variant={selectedCoin === "SOL" ? "secondary" : "ghost"} 
            size="sm" 
            className={selectedCoin === "SOL" ? "bg-cyan-400/20 text-cyan-400 hover:bg-cyan-400/30" : "bg-white/5 text-gray-400 hover:bg-white/10"}
            onClick={() => setSelectedCoin("SOL")}
          >
            SOL
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-3xl font-bold font-orbitron text-white">
              {chartData[selectedCoin as keyof typeof chartData].currentPrice}
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-green-400">{chartData[selectedCoin as keyof typeof chartData].change}</span>
              <span className="text-green-400">{chartData[selectedCoin as keyof typeof chartData].percentChange}</span>
              <span className="text-gray-400">Today</span>
            </div>
          </div>
          
          <Tabs defaultValue="1W" value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <TabsList className="bg-transparent">
              <TabsTrigger 
                value="1D" 
                className={selectedTimeframe === "1D" ? "bg-cyan-400/20 text-cyan-400" : "bg-white/5 text-gray-400 hover:bg-white/10"}
              >
                1D
              </TabsTrigger>
              <TabsTrigger 
                value="1W" 
                className={selectedTimeframe === "1W" ? "bg-cyan-400/20 text-cyan-400" : "bg-white/5 text-gray-400 hover:bg-white/10"}
              >
                1W
              </TabsTrigger>
              <TabsTrigger 
                value="1M" 
                className={selectedTimeframe === "1M" ? "bg-cyan-400/20 text-cyan-400" : "bg-white/5 text-gray-400 hover:bg-white/10"}
              >
                1M
              </TabsTrigger>
              <TabsTrigger 
                value="1Y" 
                className={selectedTimeframe === "1Y" ? "bg-cyan-400/20 text-cyan-400" : "bg-white/5 text-gray-400 hover:bg-white/10"}
              >
                1Y
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Chart */}
        <div className="w-full h-[300px] relative scanline">
          <canvas ref={chartRef} className="w-full h-full"></canvas>
          
          {/* AI Insights Overlay */}
          <div className="absolute bottom-12 right-8 bg-[#0D0E19]/80 border border-purple-500/30 p-3 rounded-lg w-64 backdrop-blur-sm">
            <div className="flex items-center">
              <i className="ri-brain-line text-purple-500 mr-2"></i>
              <h4 className="text-sm font-medium">AI Insight</h4>
            </div>
            <p className="text-xs mt-1 text-gray-300">
              Whale accumulation detected. 5 wallets have acquired over 1,200 {selectedCoin} in the last 24 hours. Bullish signal detected.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
