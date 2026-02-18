"use client";

import { Activity, Shield, Server, ExternalLink } from "lucide-react";

export default function DashboardPage() {
  const targetUrl = "https://s12eh1dx2vs1-d.space.z.ai/";

  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center p-4 bg-nexus-dark text-white overflow-hidden">
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 z-0 grid-bg opacity-40" />
      
      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-lg">
        
        {/* Status Badge */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-1.5 border border-green-500/50 rounded-full bg-green-500/10 shadow-[0_0_15px_rgba(0,255,0,0.2)] animate-pulse-slow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-green-400 tracking-widest uppercase">
              System Online
            </span>
          </div>
        </div>

        {/* Connection Card */}
        <div className="relative p-8 border border-nexus-cyan/30 rounded-xl bg-[#00101a]/80 backdrop-blur-md shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Connection Established</h1>
            <div className="text-sm text-gray-400 flex items-center justify-center gap-2">
              <span>Target:</span>
              <a 
                href={targetUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-nexus-cyan hover:underline flex items-center gap-1"
              >
                {targetUrl}
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-nexus-cyan/30 to-transparent mb-6" />

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Latency */}
            <div className="p-4 border border-white/10 rounded-lg bg-black/20">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Activity size={14} />
                <span className="text-xs uppercase tracking-wider">Latency</span>
              </div>
              <div className="text-2xl font-bold text-white">18<span className="text-sm ml-1 text-gray-500">ms</span></div>
            </div>

            {/* Security */}
            <div className="p-4 border border-white/10 rounded-lg bg-black/20">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Shield size={14} />
                <span className="text-xs uppercase tracking-wider">Security</span>
              </div>
              <div className="text-2xl font-bold text-green-400">TLS 1.3</div>
            </div>
          </div>
          
          {/* Footer Info */}
          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between text-xs text-gray-600">
            <span>NEXUS OS v9.0</span>
            <span>PROTOCOL: SECURE</span>
          </div>
        </div>

        {/* System Status Indicator */}
        <div className="mt-8 text-center text-xs text-gray-600">
          <Server className="inline w-3 h-3 mr-1" />
          Node Active: Primary Cluster
        </div>
      </div>
    </main>
  );
}
