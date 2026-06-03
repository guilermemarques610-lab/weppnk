import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type CartItem = {
  id: string;
  title: string;
  img: string;
  oldPrice: string;
  newPrice: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  totalCount: number;
  subtotalOld: number;
  subtotalNew: number;
};

const parsePrice = (s: string) => {
  const n = parseFloat(s.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", "."));
  return isNaN(n) ? 0 : n;
};

const Ctx = createContext<CartCtx | null>(null);

const STORAGE = "wepink_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(items)); } catch { /* ignore */ }
  }, [items]);

  const add = useCallback((item: Omit<CartItem, "qty">) => {
    setItems((prev) => {
      const ex = prev.find((p) => p.id === item.id);
      if (ex) return prev.map((p) => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...item, qty: 1 }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => qty <= 0
      ? prev.filter((p) => p.id !== id)
      : prev.map((p) => p.id === id ? { ...p, qty } : p));
  }, []);

  const totalCount = items.reduce((s, i) => s + i.qty, 0);
  const subtotalOld = items.reduce((s, i) => s + parsePrice(i.oldPrice) * i.qty, 0);
  const subtotalNew = items.reduce((s, i) => s + parsePrice(i.newPrice) * i.qty, 0);

  return (
    <Ctx.Provider value={{ items, open, setOpen, add, remove, setQty, totalCount, subtotalOld, subtotalNew }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
}

export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
