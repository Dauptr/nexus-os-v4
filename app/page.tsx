"use client";

import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// --- FIXED SCANNING ENGINE ---
const ScanEngine = {
    // Proxy 1: AllOrigins (JSON Method)
    fetch1: async (url: string) => {
        const target = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const res = await fetch(target);
        const data = await res.json();
        if (data.contents) return data.contents;
        throw new Error("Proxy 1 failed");
    },

    // Proxy 2: CodeTabs
    fetch2: async (url: string) => {
        const target = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
        const res = await fetch(target);
        return await res.text();
    },

    // Proxy 3: CorsProxy
    fetch3: async (url: string) => {
        const target = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const res = await fetch(target);
        return await res.text();
    },

    run: async (url: string, log: (msg: string) => void) => {
        let target = url;
        if (!target.startsWith('http')) target = 'https://' + target;

        // Try Proxy 1
        try {
            log("Engine: Trying Primary Proxy (JSON)...");
            const html = await ScanEngine.fetch1(target);
            log("Engine: Primary Success!");
            return html;
        } catch (e) { log("Engine: Primary failed."); }

        // Try Proxy 2
        try {
            log("Engine: Trying Secondary Proxy...");
            const html = await ScanEngine.fetch2(target);
            log("Engine: Secondary Success!");
            return html;
        } catch (e) { log("Engine: Secondary failed."); }

        // Try Proxy 3
        try {
            log("Engine: Trying Tertiary Proxy...");
            const html = await ScanEngine.fetch3(target);
            log("Engine: Tertiary Success!");
            return html;
        } catch (e) { log("Engine: All proxies failed."); }

        return null;
    }
};

// --- HELPER: PROCESS HTML ---
const processHtml = (html: string, url: string) => {
    const base = `<base href="${url}">`;
    if (html.includes('<head>')) {
        return html.replace('<head>', `<head>${base}`);
    }
    return base + html;
};

// --- MAIN APP COMPONENT ---
export default function Home() {
    const [url, setUrl] = useState('');
    const [code, setCode] = useState('<!-- Scan a link to begin -->');
    const [logs, setLogs] = useState(["System Ready."]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    const [showManual, setShowManual] = useState(false);
    const [manualText, setManualText] = useState('');

    const log = (msg: string) => setLogs(prev => [...prev.slice(-20), `> ${msg}`]);

    const handleScan = async () => {
        if (!url) return log("Error: No URL.");
        setLoading(true);
        log(`Target: ${url}`);
        
        const rawHtml = await ScanEngine.run(url, log);
        
        if (rawHtml) {
            const processed = processHtml(rawHtml, url);
            setCode(processed);
            log("Success: Code loaded.");
            setActiveTab('preview');
        } else {
            log("Error: Network blocked.");
            log("Solution: Use MANUAL PASTE.");
        }
        
        setLoading(false);
    };

    const downloadSingle = () => {
        const blob = new Blob([code], { type: 'text/html' });
        saveAs(blob, "nexus_scan.html");
        log("Downloaded HTML.");
    };

    const downloadZip = async () => {
        log("Building ZIP...");
        const zip = new JSZip();
        zip.file("index.html", code);
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "nexus_project.zip");
        log("Downloaded ZIP.");
    };

    const applyManual = () => {
        setCode(manualText);
        setShowManual(false);
        log("Manual code applied.");
        setActiveTab('edit');
    };

    return (
        <main className="h-screen w-screen flex flex-col bg-[#050505] text-gray-200 font-mono">
            {/* Header */}
            <header className="h-14 border-b border-gray-800 flex items-center px-6 shrink-0 bg-[#0a0a0a]">
                <h1 className="text-lg font-bold text-cyan-400 tracking-widest mr-6">NEXUS SCAN</h1>
                
                <div className="flex-1 flex items-center bg-[#111] rounded border border-gray-800 px-3">
                    <span className="text-pink-500 text-xs mr-2">LINK</span>
                    <input 
                        type="text"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="https://site.com"
                        className="flex-1 bg-transparent text-sm text-white outline-none py-2"
                        onKeyDown={e => e.key === 'Enter' && handleScan()}
                    />
                </div>

                <button 
                    onClick={handleScan}
                    disabled={loading}
                    className="ml-4 px-4 py-2 bg-cyan-900/50 hover:bg-cyan-800/50 border border-cyan-500/50 text-cyan-400 rounded text-xs"
                >
                    {loading ? "SCANNING..." : "SCAN"}
                </button>
                
                <button 
                    onClick={() => setShowManual(true)}
                    className="ml-2 px-4 py-2 bg-pink-900/30 hover:bg-pink-800/30 border border-pink-500/30 text-pink-400 rounded text-xs"
                >
                    MANUAL
                </button>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 border-r border-gray-800 flex flex-col bg-[#020202]">
                    <div className="p-3 border-b border-gray-800 text-xs text-gray-500 uppercase">
                        Console
                    </div>
                    <div className="flex-1 p-2 overflow-y-auto text-xs leading-relaxed">
                        {logs.map((l, i) => <div key={i} className="text-gray-400 mb-1">{l}</div>)}
                    </div>
                    
                    <div className="p-3 border-t border-gray-800 space-y-2">
                        <button onClick={downloadSingle} className="w-full text-left text-xs px-2 py-1 hover:bg-white/5 rounded text-gray-300">
                            ⬇ Download HTML
                        </button>
                        <button onClick={downloadZip} className="w-full text-left text-xs px-2 py-1 hover:bg-white/5 rounded text-gray-300">
                            📦 Download ZIP
                        </button>
                    </div>
                </aside>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col bg-[#050505]">
                    {/* Tabs */}
                    <div className="h-10 border-b border-gray-800 flex items-center px-4 space-x-4 bg-[#000] shrink-0">
                        <button 
                            onClick={() => setActiveTab('edit')}
                            className={`text-xs px-2 py-2 ${activeTab === 'edit' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-600'}`}
                        >
                            EDIT CODE
                        </button>
                        <button 
                            onClick={() => setActiveTab('preview')}
                            className={`text-xs px-2 py-2 ${activeTab === 'preview' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-600'}`}
                        >
                            PREVIEW
                        </button>
                    </div>

                    {/* View */}
                    <div className="flex-1 relative overflow-hidden">
                        {activeTab === 'edit' ? (
                            <textarea 
                                className="w-full h-full p-4 bg-[#080808] text-cyan-400 outline-none resize-none"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                spellCheck="false"
                            />
                        ) : (
                            <iframe 
                                srcDoc={code}
                                title="Preview"
                                className="w-full h-full bg-white"
                                sandbox="allow-scripts allow-same-origin"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Manual Modal */}
            {showManual && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-8">
                    <div className="bg-[#111] border border-cyan-900 rounded-lg w-full max-w-3xl flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                            <h3 className="text-cyan-400 font-bold">Manual Paste Mode</h3>
                            <button onClick={() => setShowManual(false)} className="text-gray-500 hover:text-white text-xl">&times;</button>
                        </div>
                        <div className="p-4 text-xs text-gray-400">
                            1. Open the link in your browser.<br/>
                            2. Right-click and "View Page Source".<br/>
                            3. Copy everything and paste below.
                        </div>
                        <textarea 
                            className="flex-1 w-full p-4 bg-[#050505] text-white outline-none"
                            placeholder="Paste HTML code here..."
                            value={manualText}
                            onChange={(e) => setManualText(e.target.value)}
                        />
                        <div className="p-4 border-t border-gray-800 flex justify-end">
                            <button 
                                onClick={applyManual}
                                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-sm font-bold"
                            >
                                Apply Code
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
