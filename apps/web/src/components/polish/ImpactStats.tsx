import React, { memo } from "react";
import { Users, Shield, Clock, Heart } from "lucide-react";

export const ImpactStats = memo(function ImpactStats() {
  const stats = [
    { label: "Safe Sessions", value: "12,400+", icon: Shield },
    { label: "Active Participants", value: "8,200+", icon: Users },
    { label: "Support Hours", value: "45k+", icon: Clock },
    { label: "Scholarships", value: "2,100+", icon: Heart },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {stats.map((stat) => (
        <div 
          key={stat.label} 
          className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center text-center group hover:bg-white/10 transition-all duration-500"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <stat.icon className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-3xl font-black text-white tracking-tighter mb-1">{stat.value}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</span>
        </div>
      ))}
    </div>
  );
});
