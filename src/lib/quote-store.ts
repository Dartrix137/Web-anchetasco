"use client";

import { create } from "zustand";

export type QuoteItemType = "product" | "pack" | "format";

export interface QuoteItem {
  id: string;
  type: QuoteItemType;
  name: string;
  detail: string;
  price: number;
  quantity: number;
}

export const MAX_ITEM_QUANTITY = 999;

const clampQuantity = (q: number) =>
  Math.max(1, Math.min(MAX_ITEM_QUANTITY, Math.round(q)));

interface QuoteStore {
  items: QuoteItem[];
  compareIds: string[];
  addItem: (
    item: Omit<QuoteItem, "quantity">,
    quantity?: number
  ) => { added: boolean; totalQuantity: number };
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearItems: () => void;
  hasItem: (id: string) => boolean;
  totalEstimate: () => number;
  totalUnits: () => number;
  toggleCompare: (id: string) => { ok: boolean; message?: string };
  clearCompare: () => void;
}

export const useQuoteStore = create<QuoteStore>((set, get) => ({
  items: [],
  compareIds: [],

  addItem: (item, quantity = 1) => {
    const qty = clampQuantity(quantity);
    const existing = get().items.find((i) => i.id === item.id);
    if (existing) {
      const totalQuantity = clampQuantity(existing.quantity + qty);
      set((state) => ({
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: totalQuantity } : i
        ),
      }));
      return { added: true, totalQuantity };
    }
    set((state) => ({ items: [...state.items, { ...item, quantity: qty }] }));
    return { added: true, totalQuantity: qty };
  },

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: clampQuantity(quantity) } : i
      ),
    })),

  clearItems: () => set({ items: [] }),

  hasItem: (id) => get().items.some((i) => i.id === id),

  totalEstimate: () =>
    get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  totalUnits: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  toggleCompare: (id) => {
    const current = get().compareIds;
    if (current.includes(id)) {
      set({ compareIds: current.filter((c) => c !== id) });
      return { ok: true, message: "Quitado de la comparación." };
    }
    if (current.length >= 3) {
      return { ok: false, message: "Puedes comparar hasta 3 productos." };
    }
    set({ compareIds: [...current, id] });
    return { ok: true, message: "Agregado a la comparación." };
  },

  clearCompare: () => set({ compareIds: [] }),
}));
