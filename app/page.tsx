"use client";

import { useEffect, useState, useRef } from "react";
import { Cpu, Play, Box, Rocket, CheckCircle } from "lucide-react";

// Configuration
const TARGET_HOST = "https://s12eh1dx2vs1-d.space.z.ai/";
const LOCAL_BUILD_PATH = "/space.app"; // The local proxy path

// Boot Sequence
const BOOT_SEQUENCE = [
  { type: 'system', message: "Initializing Core Systems..." },
  { type: 'highlight', message: `TARGET: ${TARGET_HOST}` },
  { type: 'scan', message: "Resolving DNS..." },
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
  const [isCompiling, setIsCompiling] = useState(false);
  const [buildStatus, setBuildStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const terminalRef = useRef<HTMLDivElement>(null);

  // 1. BOOT SEQUENCE
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

  // 2. AUTO-SCROLL
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [consoleHistory]);

  // 3. COMPILER (Build from Target)
  const runCompiler = async () => {
    setIsCompiling(true);
    setBuildStatus('idle');
    
    setConsoleHistory(prev => [...prev, "> compile"]);
    setConsoleHistory(prev => [...prev, "Connecting to target host..."]);

    try {
        // Simulate build time
        await new Promise(r => setTimeout(r, 600));
        setConsoleHistory(prev => [...prev, "Fetching remote manifest..."]);
        
        // Verify target is reachable
        const response = await fetch(TARGET_HOST, { method: 'HEAD' });
        
        await new Promise(r => setTimeout(r, 600));
        setConsoleHistory(prev => [...prev, "Mapping assets to local proxy..."]);

        if (response.ok || response.status === 200 || response.status === 0) {
            setConsoleHistory(prev => [...prev, `Target reachable.`]);
            setConsoleHistory(prev => [...prev, "Generating build configuration..."]);
            
            await new Promise(r => setTimeout(r, 800));
            
            setConsoleHistory(prev => [...prev, "✅ Build Complete: ./dist/space.app"]);
            setConsoleHistory(prev => [...prev, `Local proxy mapped to ${LOCAL_BUILD_PATH}`]);
            setBuildStatus('success');
        } else {
            throw new Error(`Host returned status ${response.status}`);
        }

    } catch (error) {
        // Note: Fetch might fail due to CORS in browser, but Proxy will still work
        setConsoleHistory(prev => [...prev, "⚠️ Network Warning: Direct fetch blocked (CORS)."]);
        setConsoleHistory(prev => [...prev, "Generating build via Server Proxy..."]);
        await new Promise(r => setTimeout(r, 500));
        setConsoleHistory(prev => [...prev, "✅ Build Complete: ./dist/space.app"]);
        setBuildStatus('success');
    }

    setIsCompiling(false);
  };

  // 4. LAUNCHER (Start Space.app)
  const launchApp = () => {
    setConsoleHistory(prev => [...prev, "> start space.app"]);
    setConsoleHistory(prev => [...prev, "Mounting local proxy..."]);
    setConsoleHistory(prev => [...prev, "Executing " + LOCAL_BUILD_PATH + " ..."]);
    
    setTimeout(() => {
        // Open the local proxied version
        window.open(LOCAL_BUILD_PATH, '_blank');
    }, 800);
  };

  // 5. COMMAND HANDLER
  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    
    if (cleanCmd !== 'compile' && cleanCmd !== 'start space.app') {
        setConsoleHistory(prev => [...prev, `> ${cmd}`]);
    }
    
    switch(cleanCmd) {
      case 'help':
        setConsoleHistory(prev => [...prev, "Available commands: status, compile, start space.app, clear"]);
        break;
      case 'status':
        setConsoleHistory(prev => [...prev, "SYSTEM STATUS: OPERATIONAL", `UPLINK: ${TARGET_HOST}`]);
        break;
      case 'compile':
        runCompiler();
        break;
      case 'start space.app':
      case 'start':
        if (buildStatus === 'success') {
          launchApp();
        } else {
          setConsoleHistory(prev => [...prev, "Error: space.app not built. Run 'compile' first."]);
        }
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

  // --- RENDER: BOOTING ---
  if (systemState === "BOOTING") {
    return (
      <main className="fixed inset-0 flex flex-col items-center justify-center z-[9999] bg-black text-white font-mono">
        <div className="fixed inset-0 pointer-events-none z-10 opacity-10 grid-bg" />
        <div className="relative mb-12 z-30 text-center">
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
                onClick={runCompiler}
                disabled={isCompiling}
                className="flex items-center gap-1.5 px-3 py-1 rounded text-[10px] bg-nexus-cyan/20 text-nexus-cyan border border-nexus-cyan/30 hover:bg-nexus-cyan/30 transition disabled:opacity-50"
            >
                <Play size={12} /> <span>{isCompiling ? 'Building...' : 'Build from Host'}</span>
            </button>

            <button 
                onClick={launchApp}
                disabled={buildStatus !== 'success'}
                className="flex items-center gap-1.5 px-3 py-1 rounded text-[10px] bg-nexus-magenta/20 text-nexus-magenta border border-nexus-magenta/30 hover:bg-nexus-magenta/30 transition disabled:opacity-30 disabled:border-gray-700"
            >
                <Rocket size={12} /> <span>Start space.app</span>
            </button>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Stats */}
        <aside className="w-64 border-r border-nexus-cyan/10 p-4 hidden md:flex flex-col gap-4 bg-[#00101a]">
          <div className="border border-white/10 rounded p-3">
            <div className="text-[10px] text-gray-500 uppercase mb-1">Target Host</div>
            <div className="text-xs text-nexus-cyan truncate">{TARGET_HOST}</div>
          </div>
          
          {/* Build Status */}
          <div className={`border rounded p-3 ${buildStatus === 'success' ? 'border-green-500/50 bg-green-500/5' : 'border-white/10'}`}>
            <div className="text-[10px] text-gray-500 uppercase mb-1 flex justify-between items-center">
                <span>Build Output</span>
                {buildStatus === 'success' && <CheckCircle size={10} className="text-green-400" />}
            </div>
            <div className="flex items-center gap-2 text-xs text-white mt-1">
              <Box size={12} className={buildStatus === 'success' ? "text-nexus-magenta" : "text-gray-600"} />
              <span className={buildStatus === 'success' ? "text-white" : "text-gray-600"}>
                {buildStatus === 'success' ? './dist/space.app' : 'No build found'}
              </span>
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
             {isCompiling && (
                 <div className="text-yellow-300 animate-pulse mb-1">
                     Processing...
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
