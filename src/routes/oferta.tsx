import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Sparkles, ChevronRight, CircleCheck, ShieldCheck, X, Gift, MapPin, Truck, Store } from "lucide-react";
import presellImg from "@/assets/presell-namorados.webp";
import bannerIphone from "@/assets/banner-iphone.webp";

export const Route = createFileRoute("/oferta")({
  head: () => ({
    meta: [
      { title: "Oferta Dia dos Namorados — Quiosques WePink até 85% OFF" },
      { name: "description", content: "Promoção Dia dos Namorados WePink — até 85% OFF nos Quiosques WePink. Garanta sua oferta exclusiva agora." },
      { property: "og:title", content: "Oferta Dia dos Namorados — Quiosques WePink até 85% OFF" },
      { property: "og:description", content: "Promoção Dia dos Namorados WePink — até 85% OFF nos Quiosques WePink." },
    ],
  }),
  component: OfertaPage,
});

function OfertaPage() {
  const navigate = useNavigate();
  const [dragX, setDragX] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [showCpf, setShowCpf] = useState(false);
  const [showCep, setShowCep] = useState(false);
  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);

  const KNOB_WIDTH = 64;
  const PADDING = 4;

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX - dragX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !trackRef.current) return;
    const max = trackRef.current.clientWidth - KNOB_WIDTH - PADDING * 2;
    const next = Math.max(0, Math.min(max, e.clientX - startX.current));
    setDragX(next);
    if (next >= max - 4) {
      dragging.current = false;
      setUnlocked(true);
      setTimeout(() => setShowCpf(true), 200);
    }
  };
  const onPointerUp = () => {
    if (!unlocked) setDragX(0);
    dragging.current = false;
  };

  const formatCpf = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    return d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };
  const formatCep = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 8);
    return d.replace(/(\d{5})(\d)/, "$1-$2");
  };

  const submitCpf = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCpf(false);
    setTimeout(() => setShowCep(true), 250);
  };

  // Lock body scroll when modals open
  useEffect(() => {
    document.body.style.overflow = showCpf || showCep ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showCpf, showCep]);

  const fillPx = unlocked
    ? (trackRef.current?.clientWidth ?? 0)
    : dragX + KNOB_WIDTH + PADDING;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff0f7] via-[#ffe0ef] to-[#fdf2f8] overflow-x-hidden relative">
      {/* Top banner */}
      <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-r from-[#FF00BB]/90 to-[#FF6FB5]/90 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider">
        <div className="max-w-xl mx-auto px-4 py-2 flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3" />
          Oferta oficial • quiosqueWePink
        </div>
      </div>

      <main className="max-w-xl mx-auto px-0 pb-8 pt-9">
        <div className="relative z-10">
          <img
            src={presellImg}
            alt="Promoção Dia dos Namorados WePink — até 85% OFF"
            className="w-full h-auto block max-h-[58vh] object-cover object-top"
            loading="eager"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#fdf2f8] to-transparent pointer-events-none" />
        </div>

        <section className="px-4 mt-4 relative z-0">
          <div className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(255,0,187,0.35)] border border-pink-100 overflow-hidden">
            <div className="px-6 pt-4 pb-1 text-center">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF00BB] bg-pink-50 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF00BB] animate-pulse" />
                Promoção ativa agora
              </p>
              <h1 className="mt-2 text-[20px] font-extrabold text-foreground leading-tight">
                Dia dos Namorados
                <br />
                <span className="text-[#FF00BB]">com até 85% OFF</span>
              </h1>
              <p className="mt-1.5 text-[12px] text-foreground/60 leading-snug">Garanta sua oferta exclusiva agora.</p>
            </div>

            <div className="px-5 pb-5 pt-3 space-y-3">
              <div className="space-y-3">
                <p className="text-center text-[12px] font-bold text-[#FF00BB] leading-snug whitespace-nowrap">
                  Deslize para a direita e acesse sua oferta
                </p>
                <div className="w-full select-none">
                  <div
                    ref={trackRef}
                    className="relative w-full rounded-2xl bg-gradient-to-r from-[#FFE0F3] to-[#FFD0EA] border-2 border-[#FF00BB]/40 overflow-hidden touch-none shadow-[inset_0_2px_6px_rgba(255,0,187,0.15)]"
                    style={{ height: 72 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-end pr-5 pointer-events-none">
                      <ChevronRight className="w-7 h-7 text-[#FF00BB]/50 animate-bounce" />
                    </div>
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FF00BB] to-[#FF4FB5]"
                      style={{ width: fillPx, opacity: 0.92, transition: dragging.current ? "none" : "width 200ms ease-out" }}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center text-[15px] font-extrabold uppercase tracking-wider pointer-events-none"
                      style={{ paddingLeft: 80, color: "#FF00BB" }}
                    >
                      Arraste para acessar a oferta
                    </div>
                    <div
                      onPointerDown={onPointerDown}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                      onPointerCancel={onPointerUp}
                      className="absolute top-1/2 rounded-xl bg-white shadow-[0_6px_20px_rgba(255,0,187,0.55)] flex items-center justify-center cursor-grab active:cursor-grabbing active:scale-[0.97]"
                      style={{
                        width: KNOB_WIDTH,
                        height: 56,
                        left: PADDING,
                        transform: `translate3d(${dragX}px, -50%, 0)`,
                        transition: dragging.current ? "none" : "transform 200ms ease-out",
                        touchAction: "none",
                      }}
                    >
                      <div className="rounded-full bg-gradient-to-r from-[#FF00BB] to-[#FF4FB5] p-1.5 shadow-[0_2px_8px_rgba(255,0,187,0.45)]">
                        <ChevronRight className="w-5 h-5 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                  <CircleCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-[12px] text-green-800 font-semibold leading-snug">
                    Oferta disponível na sua região! Garanta antes que acabe.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 pt-2 text-[10px] text-foreground/50">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Compra segura
                </span>
                <span>•</span>
                <span>Envio para todo Brasil</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] text-foreground/50">
            +12.480 pessoas aproveitaram nas últimas 24h
          </p>
        </section>
      </main>

      {/* CPF Modal */}
      <div
        className={`fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          showCpf ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowCpf(false)}
      />
      <div
        role="dialog"
        aria-label="Entrar com CPF"
        className={`fixed left-1/2 -translate-x-1/2 z-[90] w-[92%] max-w-sm transition-all duration-300 top-1/2 -translate-y-1/2 ${
          showCpf ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-background rounded-3xl overflow-hidden shadow-2xl border border-border">
          <div className="relative px-6 pt-7 pb-6 text-center">
            <button
              aria-label="Fechar"
              onClick={() => setShowCpf(false)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-foreground/5 text-foreground/60"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#FF00BB]/10 text-[#FF00BB] flex items-center justify-center">
              <Gift className="w-7 h-7" />
            </div>
            <h2 className="mt-4 text-[22px] font-extrabold tracking-tight text-foreground leading-tight">
              Entrar na wepink
            </h2>
            <p className="mt-1.5 text-[13px] text-foreground/60 leading-relaxed">
              Use seu CPF para acessar sua conta e
              <br />
              concorrer ao <span className="font-semibold text-foreground">iPhone 17 Pro Max</span>.
            </p>
          </div>
          <form className="px-6 pb-6 space-y-4" onSubmit={submitCpf}>
            <div>
              <label className="text-[11px] font-semibold tracking-wide uppercase text-foreground/55">CPF</label>
              <input
                inputMode="numeric"
                autoFocus
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                className="mt-1.5 w-full bg-foreground/[0.04] border border-transparent focus:border-[#FF00BB]/40 focus:bg-background rounded-xl px-4 py-3.5 text-base font-medium tracking-wide text-center focus:outline-none transition"
                placeholder="000.000.000-00"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-foreground text-background font-semibold rounded-full py-3.5 text-sm active:scale-[0.98] transition"
            >
              Entrar
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-foreground/50">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Seus dados estão protegidos</span>
            </div>
          </form>
        </div>
      </div>

      {/* CEP Modal */}
      <div
        className={`fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          showCep ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowCep(false)}
      />
      <div
        role="dialog"
        aria-label="Encontre seu quiosque WePink"
        className={`fixed left-1/2 -translate-x-1/2 z-[110] w-[94%] max-w-md top-1/2 transition-all duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          showCep
            ? "-translate-y-1/2 opacity-100 scale-100 rotate-0"
            : "-translate-y-[35%] opacity-0 scale-90 -rotate-2 pointer-events-none"
        }`}
      >
        <div className="relative bg-background rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto">
          <div className="relative">
            <img
              src={bannerIphone}
              alt="Promoção Dia dos Namorados — concorra a um iPhone 17 Pro Max"
              className="w-full h-auto block"
              loading="eager"
            />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          </div>
          <div className="px-5 pt-3 pb-2 -mt-2 relative">
            <div className="flex items-start gap-2.5 bg-gradient-to-br from-[#FF00BB]/10 via-[#FF00BB]/5 to-transparent border border-[#FF00BB]/20 rounded-xl p-3">
              <div className="w-9 h-9 rounded-full bg-[#FF00BB] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#FF00BB]/30">
                <Gift className="w-4 h-4" />
              </div>
              <div className="text-xs leading-snug">
                <p className="font-extrabold text-foreground">Comprou? Já está concorrendo 🎁</p>
                <p className="text-foreground/80 mt-1 leading-relaxed">
                  Na compra de <span className="font-extrabold text-[#FF00BB]">qualquer produto</span>, você ganha{" "}
                  <span className="font-extrabold text-[#FF00BB]">1 número da sorte</span> para concorrer a um{" "}
                  <span className="font-extrabold text-foreground underline decoration-[#FF00BB] decoration-2 underline-offset-2">
                    iPhone 17 Pro Max
                  </span>{" "}
                  ✨
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <MapPin className="w-7 h-7 text-[#FF00BB] flex-shrink-0" strokeWidth={2.5} />
              <p className="text-sm font-extrabold lowercase">
                Digite seu CEP e encontre um quiosque <span className="text-[#FF00BB]">Wepink</span> mais perto de você
              </p>
            </div>
          </div>
          <div className="px-5 pb-5 pt-2 relative bg-background">
            <form className="space-y-3" onSubmit={async (e) => {
              e.preventDefault();
              const digits = cep.replace(/\D/g, "");
              if (digits.length !== 8) { setCepError("Digite um CEP válido com 8 dígitos."); return; }
              setCepError(null);
              setCepLoading(true);
              try {
                const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
                const data = await res.json();
                if (data?.erro) { setCepError("CEP não encontrado."); setCepLoading(false); return; }
                sessionStorage.setItem("wepink_cep", JSON.stringify({
                  cep: `${digits.slice(0,5)}-${digits.slice(5)}`,
                  city: data.localidade,
                  uf: data.uf,
                  street: data.logradouro,
                  bairro: data.bairro,
                }));
                setShowCep(false);
                navigate({ to: "/" });
              } catch {
                setCepError("Erro ao buscar CEP. Tente novamente.");
              } finally {
                setCepLoading(false);
              }
            }}>
              <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Seu CEP</label>
              <div className="flex gap-2 w-full">
                <input
                  inputMode="numeric"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => { setCep(formatCep(e.target.value)); setCepError(null); }}
                  className="flex-1 min-w-0 border-2 border-border rounded-xl px-3 py-3 text-base font-semibold focus:outline-none focus:border-[#FF00BB] transition"
                />
                <button
                  type="submit"
                  disabled={cepLoading}
                  className="shrink-0 bg-[#FF00BB] text-white font-bold rounded-xl px-4 py-3 text-sm active:scale-[0.97] transition disabled:opacity-60"
                >
                  {cepLoading ? "..." : "Buscar"}
                </button>
              </div>
              {cepError && <p className="text-xs font-semibold text-red-600">{cepError}</p>}
              <span className="block text-xs text-foreground/40 cursor-default">Não sei meu CEP</span>
              <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-border">
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-[#FF00BB]/10 text-[#FF00BB] flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-foreground/70 leading-tight">Mesmo dia</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-[#FF00BB]/10 text-[#FF00BB] flex items-center justify-center">
                    <Store className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-foreground/70 leading-tight">+200 quiosques</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-[#FF00BB]/10 text-[#FF00BB] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-foreground/70 leading-tight">Frete Grátis*</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
