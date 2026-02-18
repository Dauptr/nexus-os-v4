"use client";

import { useEffect, useState } from "react";
import { Activity, Shield, Server, ExternalLink } from "lucide-react";

// Configuration: The target URL to "scan" and link to
const TARGET_URL = "https://s12eh1dx2vs1-d.space.z.ai/";

// The sequence of diagnostic steps
const BOOT_SEQUENCE = [
  { type: 'system', message: "Initializing Core Systems..." },
  { type: 'highlight', message: `TARGET: ${TARGET_URL}` },
  { type: 'scan', message: "Resolving DNS..." },
  { type: 'result', message: "IP: 10.0.1.55 (Secure Proxy)", status: 'ok' },
  { type: 'scan', message: "Pinging Host..." },
  { type: 'result', message: "Latency: 18ms", status: 'ok' },
  { type: 'scan', message: "Establishing TLS 1.3..." },
  { type: 'result', message: "Cipher: AES-256-GCM", status: 'ok' },
  { type: 'scan', message: "Linking Build Artifacts..." },
  { type: 'result', message: "Found: /_next/static/", status: 'ok' },
  { type: 'result', message: "Found: /app/", status: 'ok' },
  { type: 'system', message: "Connection Secured", status: 'ok' },
];

export default function DashboardPage() {
  const [systemState, setSystemState] = useState<"BOOTING" | "ONLINE">("BOOTING");
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (systemState !== "BOOTING") return;

    let currentStep = 0;
    const totalSteps = BOOT_SEQUENCE.length;
    
    const processLog = (index: number) => {
      if (index >= totalSteps) {
        // Boot complete -> Switch to Online Dashboard
        setTimeout(() => {
          setProgress(100);
          setTimeout(() => setSystemState("ONLINE"), 800);
        }, 500);
        return;
      }

      const step = BOOT_SEQUENCE[index];
      const delay = step.type === 'scan' ? 600 : 300;

      // Update Log
      setLogs(prev => [...prev, `▸ ${step.message}`]);
      
      // Update Progress
      const currentProgress = ((index + 1) / totalSteps) * 100;
      setProgress(currentProgress);

      setTimeout(() => processLog(index + 1), delay);
    };

    // Start sequence
    processLog(0);

  }, [systemState]);

  // --- RENDER: ONLINE STATE (DASHBOARD) ---
  if (systemState === "ONLINE") {
    return (
      <main className="fixed inset-0 flex flex-col items-center justify-center p-4 bg-nexus-dark text-white overflow-hidden">
        <div className="absolute inset-0 z-0 grid-bg opacity-40" />
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
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Connection Established</h1>
              <div className="text-sm text-gray-400 flex items-center justify-center gap-2">
                <span>Target:</span>
                <a 
                  href={TARGET_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-nexus-cyan hover:underline flex items-center gap-1"
                >
                  {TARGET_URL}
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-nexus-cyan/30 to-transparent mb-6" />

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-white/10 rounded-lg bg-black/20">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Activity size={14} />
                  <span className="text-xs uppercase tracking-wider">Latency</span>
                </div>
                <div className="text-2xl font-bold text-white">18<span className="text-sm ml-1 text-gray-500">ms</span></div>
              </div>
              <div className="p-4 border border-white/10 rounded-lg bg-black/20">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Shield size={14} />
                  <span className="text-xs uppercase tracking-wider">Security</span>
                </div>
                <div className="text-2xl font-bold text-green-400">TLS 1.3</div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between text-xs text-gray-600">
              <span>NEXUS OS v9.0</span>
              <span>PROTOCOL: SECURE</span>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-600">
            <Server className="inline w-3 h-3 mr-1" />
            Node Active: Primary Cluster
          </div>
        </div>
      </main>
    );
  }

  // --- RENDER: BOOTING STATE (SCAN) ---
  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center z-[9999] bg-nexus-dark text-white">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-10 grid-bg" />
      
      {/* Logo */}
      <div className="relative mb-12 z-30">
        <h1 className="text-6xl md:text-8xl font-bold tracking-wider transition-all duration-100 font-mono text-nexus-cyan" 
            style={{ textShadow: "0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 40px #00f0ff" }}>
            NEXUS
        </h1>
        <div className="text-center mt-2">
            <span className="text-sm tracking-[0.3em] animate-pulse text-nexus-magenta">
                DIAGNOSTIC MODE
            </span>
        </div>
        <div className="absolute -inset-10 border rounded-lg pointer-events-none animate-pulse border-nexus-cyan/30" />
      </div>

      {/* Scan Log */}
      <div className="w-80 md:w-96 space-y-4 z-30">
        <div className="h-44 overflow-hidden rounded-lg p-3 font-mono text-xs backdrop-blur-sm bg-[#000a14]/90 border border-nexus-cyan/30 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
             {logs.map((log, i) => (
                 <div key={i} className="flex items-center gap-2 mb-1 text-nexus-cyan">
                    <span>{log}</span>
                 </div>
             ))}
             <div className="cursor-blink" style={{ width: 6, height: 10, background: '#00f0ff', display: 'inline-block' }}></div>
        </div>

        <div className="space-y-2">
            <div className="h-2 rounded-full overflow-hidden bg-nexus-cyan/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                <div className="h-full rounded-full transition-all duration-200 relative overflow-hidden bg-gradient-to-r from-nexus-cyan to-nexus-magenta shadow-[0_0_15px_#00f0ff]" 
                     style={{ width: `${progress}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
            </div>
            <div className="text-center text-xs font-mono text-gray-500">
                {Math.round(progress)}% Complete
            </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .grid-bg {
          background-image: linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </main>
  );
}
