import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useTradeStore } from "./store";
import { Activity, Shield, Zap, TrendingUp, History } from "lucide-react";
import { TradingChart } from "./components/TradingChart";
import "./App.css";

function App() {
  const { price, setPrice, balance, symbol } = useTradeStore();

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      // @ts-ignore
      if (window.__TAURI_INTERNALS__) {
        const unsubscribe = await listen<{ price: number }>("price-update", (event) => {
          setPrice(event.payload.price);
        });
        unlisten = unsubscribe;
      }
    };

    setupListener();

    return () => {
      if (unlisten) unlisten();
    };
  }, [setPrice]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
            <Zap className="text-orange-500 fill-orange-500/20" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">CRUSTY <span className="text-orange-500">TRADE</span></h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-semibold">Binance Futures Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Wallet Balance</span>
            <span className="text-lg font-mono font-bold text-green-400">${balance.toFixed(2)}</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{symbol} Price</span>
            <span className="text-lg font-mono font-bold text-orange-400">${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left Column: Chart & Logs */}
        <div className="flex-[3] flex flex-col gap-4 overflow-hidden">
          {/* Chart Section */}
          <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl relative overflow-hidden flex flex-col">
            <div className="flex-1 p-2">
              <TradingChart data={[]} />
            </div>
          </div>

          {/* Trade Log */}
          <div className="h-64 bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center gap-2">
              <History size={18} className="text-gray-400" />
              <h2 className="font-semibold text-sm uppercase tracking-wider">Active Positions</h2>
            </div>
            <div className="flex-1 flex items-center justify-center text-gray-600 text-sm italic">
              No active positions found
            </div>
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="flex-1 flex flex-col gap-4 min-w-[320px]">
          {/* Preset Panel */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={18} className="text-orange-500" />
              <h2 className="font-semibold text-sm uppercase tracking-wider">Control Panel</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Strategy Preset</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500/50 transition-colors">
                  <option>Scalp (1% TP / 0.5% SL)</option>
                  <option>Swing (5% TP / 2% SL)</option>
                  <option>Meme-Mode (High Volatility)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Leverage</label>
                  <input type="number" defaultValue={20} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500/50" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Risk %</label>
                  <input type="number" defaultValue={1} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500/50" />
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 font-bold py-4 rounded-2xl transition-all active:scale-[0.98]">
                  OPEN LONG
                </button>
                <button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-bold py-4 rounded-2xl transition-all active:scale-[0.98]">
                  OPEN SHORT
                </button>
              </div>
            </div>
          </div>

          {/* Risk Info */}
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-orange-500" />
              <h2 className="font-semibold text-sm uppercase tracking-wider">Risk Management</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Slippage Guard</span>
                <span className="text-green-500 font-bold">ACTIVE (0.5%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Daily Loss Limit</span>
                <span className="text-white font-mono">3% / $30.00</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-2">
                <div className="bg-orange-500 h-full w-[10%] rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
