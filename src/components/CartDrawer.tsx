import { useEffect } from "react";
import { X, ShoppingBag, Minus, Plus, Trash2, Lock, PartyPopper } from "lucide-react";
import { useCart, formatBRL } from "@/lib/cart";
import { useNavigate } from "@tanstack/react-router";

export function CartDrawer() {
  const { items, open, setOpen, remove, setQty, totalCount, subtotalOld, subtotalNew } = useCart();
  const navigate = useNavigate();
  const savings = Math.max(0, subtotalOld - subtotalNew);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[120] bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        role="dialog"
        aria-label="Minha sacola"
        className={`fixed top-0 right-0 z-[130] h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <div className="relative">
              <ShoppingBag className="w-6 h-6 text-[#FF00BB]" strokeWidth={2.5} />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF00BB] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </div>
            <h2 className="text-[#FF00BB] font-extrabold text-lg lowercase">minha sacola</h2>
          </div>
          <button aria-label="Fechar" onClick={() => setOpen(false)} className="p-1">
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 bg-foreground/[0.02]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 text-foreground/60">
              <ShoppingBag className="w-12 h-12 mb-3 text-foreground/30" />
              <p className="font-semibold">Sua sacola está vazia</p>
              <p className="text-xs mt-1">Adicione produtos para aproveitar a promoção.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.id} className="bg-white rounded-xl border border-border p-3 flex gap-3">
                  <div className="w-16 h-16 shrink-0 bg-foreground/[0.03] rounded-lg overflow-hidden flex items-center justify-center">
                    <img src={it.img} alt={it.title} className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[13px] font-bold leading-tight line-clamp-2">{it.title}</h3>
                      <button aria-label="Remover" onClick={() => remove(it.id)} className="text-foreground/40 hover:text-red-500 shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-through mt-1">{it.oldPrice}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[14px] font-extrabold text-[#FF00BB]">{it.newPrice}</p>
                      <div className="flex items-center gap-2 border border-border rounded-full px-1">
                        <button
                          aria-label="Diminuir"
                          onClick={() => setQty(it.id, it.qty - 1)}
                          className="w-6 h-6 flex items-center justify-center text-foreground/70"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{it.qty}</span>
                        <button
                          aria-label="Aumentar"
                          onClick={() => setQty(it.id, it.qty + 1)}
                          className="w-6 h-6 flex items-center justify-center text-foreground/70"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="border-t border-border bg-white px-4 py-4 space-y-3">
            <div className="flex items-end justify-between">
              <span className="text-foreground/70 text-sm">Subtotal</span>
              <div className="text-right">
                {subtotalOld > subtotalNew && (
                  <p className="text-xs text-muted-foreground line-through">{formatBRL(subtotalOld)}</p>
                )}
                <p className="text-2xl font-extrabold text-[#FF00BB] leading-none">{formatBRL(subtotalNew)}</p>
              </div>
            </div>
            {savings > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2">
                <PartyPopper className="w-4 h-4 text-green-700 shrink-0" />
                <p className="text-[12px] font-semibold text-green-800">
                  Você está economizando {formatBRL(savings)}
                </p>
              </div>
            )}
            <p className="text-[11px] text-foreground/50 text-center">Frete e cupons calculados na próxima etapa.</p>
            <button
              onClick={() => { setOpen(false); navigate({ to: "/oferta" }); }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-full py-3.5 text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition"
            >
              <Lock className="w-4 h-4" /> FINALIZAR COMPRA SEGURA
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-full border-2 border-[#FF00BB] text-[#FF00BB] font-bold rounded-full py-3 text-sm active:scale-[0.98] transition"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
