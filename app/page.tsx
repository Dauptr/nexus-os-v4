"use client";

import { useEffect, useState, useRef } from "react";
import { Activity, Shield, Terminal, Cpu, ExternalLink, Play, Box } from "lucide-react";

// Configuration
const TARGET_URL = "https://s12eh1dx2vs1-d.space.z.ai/";

// Boot Sequence Data
const BOOT_SEQUENCE = [
  { type: 'system', message: "Initializing Core Systems..." },
  { type: 'highlight', message: `TARGET: ${TARGET_URL}` },
  { type: 'scan', message: "Resolving DNS..." },
  { type: 'result', message: "IP: 10.0.1.55 (Secure Proxy)", status: 'ok' },
  { type: 'scan', message: "Pinging Host..." },
  { type: 'result', message: "Latency: 18ms", status: 'ok' },
  { type: 'scan', message: "Linking Build Artifacts..." },
  { type: 'result', message: "Engine Started", status: 'ok' },
];

export default function EnginePage() {
  const [systemState, setSystemState] = useState<"BOOTING" | "ONLINE">("BOOTING");
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  // Engine State
  const [consoleHistory, setConsoleHistory] = useState<string[]>([
    "NEXUS OS v9.0 initialized.", 
    "Type 'help' for available commands."
  ]);
  const [inputValue, setInputValue] = useState("");
  const [buildProgress, setBuildProgress] = useState<string | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // 1. BOOT SEQUENCE LOGIC
  useEffect(() => {
    if (systemState !== "BOOTING") return;

    let currentStep = 0;
    const totalSteps = BOOT_SEQUENCE.length;
    
    const processLog = (index: number) => {
      if (index >= totalSteps) {
        setTimeout(() => {
          setProgress(100);
          setTimeout(() => setSystemState("ONLINE"), 800);
        }, 500);
        return;
      }

      const step = BOOT_SEQUENCE[index];
      const delay = step.type === 'scan' ? 500 : 200;

      setLogs(prev => [...prev, `▸ ${step.message}`]);
      setProgress(((index + 1) / totalSteps) * 100);
      setTimeout(() => processLog(index + 1), delay);
    };

    processLog(0);
  }, [systemState]);

  // 2. TERMINAL AUTO-SCROLL
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [consoleHistory, buildProgress]);

  // 3. SIMULATED COMPILER
  const runCompiler = () => {
    setBuildProgress("Initializing compiler...");
    
    const steps = [
      "Resolving dependencies...",
      "Compiling main bundle...",
      "Optimizing assets...",
      "Packing modules...",
      `Building 'space.app'...`
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setBuildProgress(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        setBuildProgress(null);
        setConsoleHistory(prev => [...prev, "✅ Build successful: ./dist/space.app"]);
      }
    }, 800);
  };

  // 4. COMMAND HANDLER
  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    
    setConsoleHistory(prev => [...prev, `> ${cmd}`]);
    
    switch(cleanCmd) {
      case 'help':
        setConsoleHistory(prev => [...prev, "Available commands: status, compile, preview, clear"]);
        break;
      case 'status':
        setConsoleHistory(prev => [...prev, "SYSTEM STATUS: OPERATIONAL", `UPLINK: ${TARGET_URL}`]);
        break;
      case 'compile':
        runCompiler();
        break;
      case 'preview':
        setConsoleHistory(prev => [...prev, `Opening preview: ${TARGET_URL}`]);
        window.open(TARGET_URL, '_blank');
        break;
      case 'clear':
        setConsoleHistory([]);
        break;
      default:
        setConsoleHistory(prev => [...prev, `Command not found: ${cmd}`]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputValue);
    }
  };

  // --- RENDER: BOOTING STATE ---
  if (systemState === "BOOTING") {
    return (
      <main className="fixed inset-0 flex flex-col items-center justify-center z-[9999] bg-black text-white font-mono">
        <div className="fixed inset-0 pointer-events-none z-10 opacity-10 grid-bg" />
        
        <div className="relative mb-12 z-30">
          <h1 className="text-6xl md:text-8xl font-bold tracking-wider text-nexus-cyan" 
              style={{ textShadow: "0 0 10px #00f0ff, 0 0 20px #00f0ff" }}>
              NEXUS
          </h1>
          <div className="text-center mt-2">
              <span className="text-sm tracking-[0.3em] animate-pulse text-nexus-magenta">
                  DIAGNOSTIC MODE
              </span>
          </div>
        </div>

        <div className="w-80 md:w-96 space-y-4 z-30">
          <div className="h-44 overflow-hidden rounded-lg p-3 text-xs bg-[#001020] border border-nexus-cyan/30 shadow-lg">
               {logs.map((log, i) => (
                   <div key={i} className="flex items-center gap-2 mb-1 text-nexus-cyan">
                      <span>{log}</span>
                   </div>
               ))}
          </div>
          <div className="space-y-2">
              <div className="h-2 rounded-full overflow-hidden bg-nexus-cyan/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-nexus-cyan to-nexus-magenta" style={{ width: `${progress}%` }} />
              </div>
          </div>
        </div>
      </main>
    );
  }

  // --- RENDER: ONLINE ENGINE ---
  return (
    <main className="fixed inset-0 flex flex-col bg-[#050505] text-white font-mono overflow-hidden">
      
      {/* Top Bar */}
      <header className="h-12 border-b border-nexus-cyan/20 flex items-center justify-between px-4 bg-black/50 backdrop-blur z-50">
        <div className="flex items-center gap-2 text-nexus-cyan">
          <Cpu size={16} />
          <span className="text-xs font-bold tracking-widest">NEXUS ENGINE v9.0</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
            <button 
                onClick={() => handleCommand('compile')}
                disabled={!!buildProgress}
                className="flex items-center gap-1.5 px-3 py-1 rounded text-[10px] bg-nexus-cyan/20 text-nexus-cyan border border-nexus-cyan/30 hover:bg-nexus-cyan/30 transition disabled:opacity-50"
            >
                <Play size={12} /> <span>{buildProgress ? 'Compiling...' : 'Build space.app'}</span>
            </button>

            <a 
                href={TARGET_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded text-[10px] bg-white/10 text-white border border-white/20 hover:bg-white/20 transition"
            >
                <ExternalLink size={12} /> <span>App Preview</span>
            </a>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Stats */}
        <aside className="w-64 border-r border-nexus-cyan/10 p-4 hidden md:flex flex-col gap-4 bg-[#00101a]">
          <div className="border border-white/10 rounded p-3">
            <div className="text-[10px] text-gray-500 uppercase mb-1">Target Host</div>
            <div className="text-xs text-nexus-cyan truncate">{TARGET_URL}</div>
          </div>
          
          <div className="border border-white/10 rounded p-3">
            <div className="text-[10px] text-gray-500 uppercase mb-1">Build Output</div>
            <div className="flex items-center gap-2 text-xs text-white mt-1">
              <Box size={12} className="text-nexus-magenta" />
              <span>space.app</span>
            </div>
          </div>
        </aside>

        {/* Right Panel: Terminal */}
        <div className="flex-1 flex flex-col bg-[#000001] relative">
           <div className="absolute inset-0 z-0 grid-bg opacity-20" />
           
           {/* Output Area */}
           <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto z-10 text-xs leading-relaxed">
             {consoleHistory.map((line, i) => (
               <div key={i} className={`mb-1 ${line.startsWith('>') ? 'text-white' : 'text-nexus-cyan/80'}`}>
                 {line}
               </div>
             ))}
             {/* Show build progress if active */}
             {buildProgress && (
                 <div className="text-yellow-300 animate-pulse mb-1">
                     {buildProgress}
                 </div>
             )}
           </div>

           {/* Input Area */}
           <div className="h-10 border-t border-nexus-cyan/20 flex items-center px-4 bg-black/80 z-10">
             <span className="text-nexus-magenta mr-2">$</span>
             <input 
               type="text"
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyDown={handleKeyDown}
               className="flex-1 bg-transparent outline-none text-white text-xs caret-nexus-cyan"
               placeholder="Enter command..."
               autoFocus
             />
           </div>
        </div>
      </div>
      
      {/* CSS */}
      <style jsx global>{`
        .grid-bg {
          background-image: linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px);
          background-size: 2rem 2rem;
        }
      `}</style>
    </main>
  );
}
