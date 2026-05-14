import { create } from 'zustand';

interface TradeState {
  symbol: String;
  price: number;
  balance: number;
  positions: any[];
  setPrice: (price: number) => void;
  setBalance: (balance: number) => void;
  addPosition: (pos: any) => void;
}

export const useTradeStore = create<TradeState>((set) => ({
  symbol: 'BTCUSDT',
  price: 0,
  balance: 1000,
  positions: [],
  setPrice: (price) => set({ price }),
  setBalance: (balance) => set({ balance }),
  addPosition: (pos) => set((state) => ({ positions: [...state.positions, pos] })),
}));
