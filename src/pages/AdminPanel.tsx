import React from 'react';
import { Database, Server, Users, Activity, Settings as SettingsIcon, AlertCircle, Shield, Globe } from 'lucide-react';

export default function AdminPanel() {
  return (
    <div className="h-full bg-slate-900 text-slate-300 p-6 overflow-y-auto font-mono">
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-500 font-bold tracking-widest uppercase text-xs mb-2">
              <Shield className="w-4 h-4" /> System Administrator
            </div>
            <h1 className="text-2xl font-bold text-white">LumoraAI Control Center</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-xs font-bold uppercase tracking-wider">
               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
               System Online
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {/* Metric Cards */}
           <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-lg flex flex-col justify-between">
             <div className="flex justify-between items-start mb-4">
               <Users className="w-5 h-5 text-blue-400" />
               <span className="text-xs font-bold text-emerald-400">+12%</span>
             </div>
             <div>
               <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Active Students</p>
               <h3 className="text-2xl font-bold text-white">12,450</h3>
             </div>
           </div>
           
           <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-lg flex flex-col justify-between">
             <div className="flex justify-between items-start mb-4">
               <Server className="w-5 h-5 text-purple-400" />
               <span className="text-xs font-bold text-slate-400">Stable</span>
             </div>
             <div>
               <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Model Latency</p>
               <h3 className="text-2xl font-bold text-white">245<span className="text-sm text-slate-500 ml-1">ms</span></h3>
             </div>
           </div>
           
           <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-lg flex flex-col justify-between">
             <div className="flex justify-between items-start mb-4">
               <Database className="w-5 h-5 text-amber-400" />
               <span className="text-xs font-bold text-rose-400">85% Cap</span>
             </div>
             <div>
               <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Storage Usage</p>
               <h3 className="text-2xl font-bold text-white">4.2<span className="text-sm text-slate-500 ml-1">TB</span></h3>
             </div>
           </div>
           
           <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-lg flex flex-col justify-between">
             <div className="flex justify-between items-start mb-4">
               <Activity className="w-5 h-5 text-emerald-400" />
               <span className="text-xs font-bold text-emerald-400">Healthy</span>
             </div>
             <div>
               <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">API Requests</p>
               <h3 className="text-2xl font-bold text-white">1.2M<span className="text-sm text-slate-500 ml-1">/day</span></h3>
             </div>
           </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" /> Network Traffic Logs
            </h3>
            
            <div className="space-y-2 text-xs">
              {[
                { ip: "192.168.1.104", action: "POST /api/generate-quiz", status: 200, time: "Just now" },
                { ip: "10.0.0.52", action: "GET /api/user/profile", status: 200, time: "2s ago" },
                { ip: "172.16.0.11", action: "POST /api/notebook-lm", status: 200, time: "5s ago" },
                { ip: "192.168.1.205", action: "WS /live (Audio Stream)", status: 101, time: "12s ago" },
                { ip: "10.0.0.99", action: "POST /api/generate-infographic", status: 500, time: "1m ago" },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 w-24">{log.ip}</span>
                    <span className="text-blue-300">{log.action}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`${log.status === 200 || log.status === 101 ? 'text-emerald-400' : 'text-rose-400'}`}>{log.status}</span>
                    <span className="text-slate-500 w-16 text-right">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 flex flex-col">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <SettingsIcon className="w-4 h-4 text-slate-400" /> Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700 rounded transition-colors text-sm text-left">
                <span>Clear Cache</span>
                <span className="text-xs text-slate-500">2.1GB</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700 rounded transition-colors text-sm text-left">
                <span>Restart Live Services</span>
                <span className="text-xs text-rose-400 uppercase">Warning</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700 rounded transition-colors text-sm text-left">
                <span>Update Model Weights</span>
                <span className="text-xs text-emerald-400 uppercase">v2.5.4</span>
              </button>
            </div>
            
            <div className="mt-auto pt-6 border-t border-slate-700">
              <div className="flex items-start gap-3 text-amber-400 bg-amber-400/10 p-3 rounded border border-amber-400/20">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-xs leading-relaxed">Storage is approaching 85% capacity. Consider archiving inactive user data before end of month.</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
