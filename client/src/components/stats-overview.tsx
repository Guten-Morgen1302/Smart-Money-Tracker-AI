import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string; 
  value: string;
  label: string;
  labelValue: string;
  changePercentage: string;
  changeDirection: "up" | "down" | "neutral";
  color: "blue" | "purple" | "green" | "pink";
  count?: string;
};

function StatCard({
  title,
  value,
  label,
  labelValue,
  changePercentage,
  changeDirection,
  color,
  count
}: StatCardProps) {
  const colorMap = {
    blue: {
      border: "border-cyan-400/20 hover:border-cyan-400/50",
      bg: "bg-cyan-400/10",
      text: "text-cyan-400",
    },
    purple: {
      border: "border-purple-500/20 hover:border-purple-500/50",
      bg: "bg-purple-500/10",
      text: "text-purple-500",
    },
    green: {
      border: "border-green-400/20 hover:border-green-400/50",
      bg: "bg-green-400/10",
      text: "text-green-400",
    },
    pink: {
      border: "border-pink-500/20 hover:border-pink-500/50",
      bg: "bg-pink-500/10",
      text: "text-pink-500",
    },
  };

  return (
    <div className={cn("bg-[#191A2A] border rounded-lg p-4 relative overflow-hidden transition-all duration-300", colorMap[color].border)}>
      <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-bl-full", colorMap[color].bg)}></div>
      <div className="relative">
        <div className="flex items-center">
          <h3 className="text-gray-400 text-sm">{title}</h3>
          <span className={cn("ml-auto text-xs px-2 py-0.5 rounded-full", colorMap[color].bg, colorMap[color].text)}>
            {changeDirection === "up" ? "↑" : changeDirection === "down" ? "↓" : ""} {changePercentage}
          </span>
        </div>
        <p className="mt-2 text-2xl font-orbitron font-bold">{value}</p>
        <div className="mt-3 flex items-center text-xs text-gray-400">
          <span>{label}</span>
          <span className={cn("ml-auto", colorMap[color].text)}>{labelValue}</span>
        </div>
      </div>
    </div>
  );
}

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Market Activity"
        value="High"
        label="Whale transactions"
        labelValue="+215 today"
        changePercentage="12%"
        changeDirection="up"
        color="blue"
      />
      
      <StatCard
        title="Tracked Wallets"
        value="856"
        label="High risk wallets"
        labelValue="28 active"
        changePercentage="3%"
        changeDirection="up"
        color="purple"
      />
      
      <StatCard
        title="AI Predictions"
        value="9 Signals"
        label="Accuracy rate"
        labelValue="89%"
        changePercentage="5 new"
        changeDirection="neutral"
        color="green"
      />
      
      <StatCard
        title="Custom Alerts"
        value="12 Active"
        label="Triggered today"
        labelValue="3 alerts"
        changePercentage="2"
        changeDirection="up"
        color="pink"
      />
    </div>
  );
}
