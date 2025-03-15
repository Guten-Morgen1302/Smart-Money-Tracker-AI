import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
 
type WalletMiniChartProps = {
  data: number[];
  walletType: string;
};

export default function WalletMiniChart({ data, walletType }: WalletMiniChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  // Get color based on wallet type
  const getChartColor = (type: string): string => {
    switch(type) {
      case "Smart Money":
        return '#00E5FF';
      case "Institution":
        return '#BD00FF';
      case "Risk Alert":
        return '#FF0077';
      default:
        return '#39FF14';
    }
  };
  
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        const lineColor = getChartColor(walletType);
        
        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: Array(data.length).fill(''),
            datasets: [{
              data: data,
              borderColor: lineColor,
              borderWidth: 1.5,
              pointRadius: 0,
              tension: 0.4,
              fill: false
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
                enabled: false
              }
            },
            scales: {
              x: {
                display: false
              },
              y: {
                display: false
              }
            },
            elements: {
              line: {
                borderWidth: 1
              }
            }
          }
        });
        
        return () => {
          chart.destroy();
        };
      }
    }
  }, [data, walletType]);
  
  return <canvas ref={chartRef} className="w-full h-full absolute"></canvas>;
}
