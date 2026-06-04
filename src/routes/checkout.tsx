import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Lock, User, Truck, CreditCard, CheckCircle2, PartyPopper,
  ShieldCheck, ShoppingBag, MapPin, Package, Zap, Bike, Copy, Loader2, QrCode,
} from "lucide-react";
import { useCart, formatBRL } from "@/lib/cart";
import { createFreePayPix, getFreePayTransaction } from "@/lib/freepay.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Quiosque WePink" },
      { name: "description", content: "Finalize seu pedido com segurança no Quiosque WePink." },
    ],
  }),
  component: CheckoutPage,
});

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { id: 1, label: "Identificação", icon: User },
  { id: 2, label: "Entrega", icon: Truck },
  { id: 3, label: "Pagamento", icon: CreditCard },
  { id: 4, label: "Finalizar", icon: CheckCircle2 },
] as const;

const maskCpf = (v: string) => v.replace(/\D/g, "").slice(0, 11)
  .replace(/(\d{3})(\d)/, "$1.$2")
  .replace(/(\d{3})(\d)/, "$1.$2")
  .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const maskPhone = (v: string) => v.replace(/\D/g, "").slice(0, 11)
  .replace(/(\d{2})(\d)/, "($1) $2")
  .replace(/(\d{5})(\d)/, "$1-$2");

const maskCep = (v: string) => v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");

const maskCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
const maskExp = (v: string) => v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotalOld, subtotalNew, totalCount } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [shipping, setShipping] = useState<"correios" | "full" | "moto">("correios");
  const [payment, setPayment] = useState<"pix" | "card">("pix");

  // form state
  const [form, setForm] = useState({
    name: "", email: "", phone: "", cpf: "",
    cep: "", address: "", number: "", complement: "", district: "", city: "", state: "",
    cardNumber: "", cardName: "", cardExp: "", cardCvv: "", installments: "1",
  });

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let v = e.target.value;
    if (k === "cpf") v = maskCpf(v);
    if (k === "phone") v = maskPhone(v);
    if (k === "cep") v = maskCep(v);
    if (k === "cardNumber") v = maskCard(v);
    if (k === "cardExp") v = maskExp(v);
    setForm((f) => ({ ...f, [k]: v }));
  };

  const shippingCost = shipping === "correios" ? 0 : shipping === "full" ? 12.9 : 19.9;
  const total = subtotalNew + shippingCost;
  const savings = Math.max(0, subtotalOld - subtotalNew);

  // FreePay Pix state
  const createPix = useServerFn(createFreePayPix);
  const checkTx = useServerFn(getFreePayTransaction);
  const [pix, setPix] = useState<{ id: string; qr: string; url: string; status: string } | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Polling do status
  useEffect(() => {
    if (!pix || pix.status === "PAID") return;
    const interval = setInterval(async () => {
      try {
        const r = await checkTx({ data: { id: pix.id } });
        if (r.ok && r.status !== pix.status) {
          setPix((p) => (p ? { ...p, status: r.status } : p));
          if (r.status === "PAID") setStep(4);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [pix, checkTx]);

  const handleFinalize = async () => {
    if (payment !== "pix") { setStep(4); return; }
    setPaying(true); setPayError(null);
    try {
      const parsePriceLocal = (s: string) => {
        const n = parseFloat(s.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", "."));
        return isNaN(n) ? 0 : n;
      };
      const fpItems = items.length > 0
        ? items.map((it) => ({
            title: it.title.slice(0, 100),
            unit_price: Math.max(1, Math.round(parsePriceLocal(it.newPrice) * 100)),
            quantity: it.qty,
            tangible: true,
          }))
        : [{ title: "Pedido WePink", unit_price: Math.round(total * 100), quantity: 1, tangible: true }];

      const r = await createPix({
        data: {
          amount: Math.round(total * 100),
          customer: {
            name: form.name, email: form.email,
            phone: form.phone, document: form.cpf,
          },
          items: fpItems,
          shipping: {
            fee: Math.round(shippingCost * 100),
            address: {
              street: form.address, street_number: form.number,
              complement: form.complement || undefined,
              zip_code: form.cep, neighborhood: form.district || "Centro",
              city: form.city, state: form.state, country: "BR",
            },
          },
        },
      });
      if (!r.ok) { setPayError(r.error); return; }
      setPix({ id: r.id, qr: r.qr_code, url: r.qr_url, status: r.status });
    } catch (e: any) {
      setPayError(e?.message ?? "Erro ao gerar Pix");
    } finally {
      setPaying(false);
    }
  };

  const copyPix = async () => {
    if (!pix?.qr) return;
    try { await navigator.clipboard.writeText(pix.qr); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const back = () => {
    if (step === 1) navigate({ to: "/" });
    else setStep((s) => (s - 1) as Step);
  };

  return (
    <div className="min-h-screen bg-[#FFF5FA]">
      {/* Top promo bar */}
      <div className="bg-gradient-to-r from-[#FF00BB] to-[#ff3acb] text-white text-[11px] font-extrabold tracking-wide flex items-center justify-between px-4 py-1.5">
        <span>★ ÚLTIMO DIA DE PROMOÇÃO</span>
        <span>17 PESSOAS COMPRANDO</span>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-pink-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <button onClick={back} className="flex items-center gap-1 text-foreground text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <h1 className="text-[#FF00BB] font-extrabold text-lg lowercase tracking-tight" style={{ fontFamily: "'Pacifico', cursive" }}>
          quiosquewepink
        </h1>
        <div className="flex items-center gap-1 text-foreground/70 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" /> Compra segura
        </div>
      </header>

      {/* Stepper */}
      <div className="bg-white border-b border-pink-100 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {STEPS.map((s, i) => {
            const active = step === s.id;
            const done = step > s.id;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex-1 flex flex-col items-center relative">
                {i > 0 && (
                  <div className={`absolute top-5 right-1/2 w-full h-[2px] ${done || active ? "bg-[#FF00BB]" : "bg-pink-100"}`} />
                )}
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition
                  ${active ? "bg-[#FF00BB] border-[#FF00BB] text-white" :
                    done ? "bg-white border-[#FF00BB] text-[#FF00BB]" :
                    "bg-white border-pink-200 text-pink-300"}`}>
                  {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-[11px] font-bold mt-1 ${active ? "text-[#FF00BB]" : done ? "text-foreground/80" : "text-foreground/40"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <main className="max-w-md mx-auto px-3 py-4 space-y-3">
        {/* Order Summary Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-pink-100 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#FF00BB]" />
            <h2 className="font-extrabold text-foreground text-[15px]">Resumo do pedido</h2>
          </div>
          <div className="divide-y divide-pink-50">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-foreground/50">Sua sacola está vazia.</p>
            ) : items.map((it) => (
              <div key={it.id} className="px-4 py-3 flex gap-3 items-center">
                <div className="w-14 h-14 bg-pink-50 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                  <img src={it.img} alt={it.title} className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold leading-tight">{it.title}</p>
                  <p className="text-[11px] text-foreground/60">Qtd: {it.qty}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-muted-foreground line-through">{it.oldPrice}</p>
                  <p className="text-[14px] font-extrabold text-green-600">{it.newPrice}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-pink-50/40 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/70">Subtotal ({totalCount} {totalCount === 1 ? "item" : "itens"})</span>
              <div className="flex gap-2">
                {subtotalOld > subtotalNew && <span className="text-muted-foreground line-through">{formatBRL(subtotalOld)}</span>}
                <span className="font-bold text-green-600">{formatBRL(subtotalNew)}</span>
              </div>
            </div>
            {step >= 2 && (
              <div className="flex justify-between">
                <span className="text-foreground/70">Frete</span>
                <span className="font-bold text-green-600">{shippingCost === 0 ? "Grátis" : formatBRL(shippingCost)}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-pink-100">
              <span className="font-extrabold text-foreground">Total</span>
              <div className="text-right">
                <span className="font-extrabold text-green-600 text-lg">{formatBRL(total)}</span>
                <p className="text-[10px] text-foreground/60">ou 3x de {formatBRL(total / 3)} sem juros</p>
              </div>
            </div>
            {savings > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2 mt-2">
                <PartyPopper className="w-4 h-4 text-green-700 shrink-0" />
                <p className="text-[12px] font-semibold text-green-800">
                  Você está economizando {formatBRL(savings)}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Step 1: Dados pessoais */}
        {step === 1 && (
          <section className="bg-white rounded-2xl shadow-sm border border-pink-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-[#FF00BB]" />
              <h2 className="font-extrabold text-foreground text-[15px]">Dados pessoais</h2>
            </div>
            <div className="space-y-3">
              <Field label="Nome completo">
                <input value={form.name} onChange={set("name")} placeholder="Nome e sobrenome" className={inputCls} />
              </Field>
              <Field label="E-mail">
                <input type="email" value={form.email} onChange={set("email")} placeholder="seu@email.com" className={inputCls} />
              </Field>
              <Field label="Telefone">
                <input value={form.phone} onChange={set("phone")} placeholder="(85) 9 9999-9999" className={inputCls} />
              </Field>
              <Field label="CPF/CNPJ">
                <input value={form.cpf} onChange={set("cpf")} placeholder="Número do documento" className={inputCls} />
              </Field>
            </div>
            <button onClick={() => setStep(2)} disabled={!form.name || !form.email || !form.phone || !form.cpf}
              className="mt-5 w-full bg-gradient-to-r from-pink-300 to-pink-400 disabled:opacity-60 hover:from-[#FF00BB] hover:to-[#ff3acb] text-white font-bold rounded-full py-3.5 text-sm transition active:scale-[0.99]">
              Continuar para Entrega ›
            </button>
          </section>
        )}

        {/* Step 2: Entrega */}
        {step === 2 && (
          <>
            <section className="bg-white rounded-2xl shadow-sm border border-pink-100 p-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-[#FF00BB]" />
                <h2 className="font-extrabold text-foreground text-[15px]">Endereço de entrega</h2>
              </div>
              <p className="text-[12px] text-foreground/60 mb-3">Este é o endereço onde você receberá os produtos.</p>
              <div className="space-y-3">
                <Field label="CEP"><input value={form.cep} onChange={set("cep")} placeholder="00000-000" className={inputCls} /></Field>
                <Field label="Endereço"><input value={form.address} onChange={set("address")} placeholder="Rua, avenida..." className={inputCls} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Número"><input value={form.number} onChange={set("number")} placeholder="123" className={inputCls} /></Field>
                  <Field label="Complemento (opcional)"><input value={form.complement} onChange={set("complement")} placeholder="Apto 12" className={inputCls} /></Field>
                </div>
                <Field label="Bairro"><input value={form.district} onChange={set("district")} className={inputCls} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Cidade"><input value={form.city} onChange={set("city")} className={inputCls} /></Field>
                  <Field label="Estado"><input value={form.state} onChange={set("state")} className={inputCls} /></Field>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-pink-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-4 h-4 text-[#FF00BB]" />
                <h2 className="font-extrabold text-foreground text-[15px]">Escolha o frete</h2>
              </div>
              <div className="space-y-2.5">
                <ShipOption
                  selected={shipping === "correios"} onClick={() => setShipping("correios")}
                  icon={<Package className="w-5 h-5 text-[#FFCD00]" />} title="Correios PAC"
                  badge={<span className="bg-green-500 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">GRÁTIS</span>}
                  desc="Entrega de 3 a 5 dias" price="Grátis" priceCls="text-green-600"
                />
                <ShipOption
                  selected={shipping === "full"} onClick={() => setShipping("full")}
                  icon={<Zap className="w-5 h-5 text-green-600 fill-green-600" />} title="FULL"
                  badge={<span className="bg-[#FF00BB] text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">MAIS RÁPIDO</span>}
                  desc="Entrega expressa de 12h a 24h" price="R$ 12,90" priceCls="text-green-600"
                />
                <ShipOption
                  selected={shipping === "moto"} onClick={() => setShipping("moto")}
                  icon={<Bike className="w-5 h-5 text-[#FF00BB]" />} title="Moto wepink"
                  badge={<span className="bg-orange-100 text-orange-600 text-[9px] font-bold rounded-full px-1.5 py-0.5">RECEBA HOJE</span>}
                  desc="Entrega aberta das 9h às 22h" price="R$ 19,90" priceCls="text-green-600"
                />
              </div>
            </section>

            <button onClick={() => setStep(3)} disabled={!form.cep || !form.address || !form.number || !form.city || !form.state}
              className="w-full bg-gradient-to-r from-[#FF00BB] to-[#ff3acb] disabled:opacity-60 text-white font-bold rounded-full py-3.5 text-sm transition active:scale-[0.99] shadow-md shadow-pink-200">
              Continuar para Pagamento ›
            </button>
          </>
        )}

        {/* Step 3: Pagamento */}
        {step === 3 && (
          <>
            <section className="bg-white rounded-2xl shadow-sm border border-pink-100 p-4">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-[#FF00BB]" />
                <h2 className="font-extrabold text-foreground text-[15px]">Selecione a forma de pagamento</h2>
              </div>
              <p className="text-[12px] text-foreground/60 mb-3">Escolha como deseja pagar seu pedido</p>
              <div className="space-y-2.5">
                <button onClick={() => { setPayment("pix"); if (!pix && !paying) handleFinalize(); }}
                  className={`w-full text-left rounded-xl border-2 p-3 flex items-center gap-3 transition
                    ${payment === "pix" ? "border-[#FF00BB] bg-pink-50/40" : "border-pink-100 bg-white"}`}>
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#00B8A9" strokeWidth="2"><path d="M12 2 L22 12 L12 22 L2 12 Z" /></svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-[14px]">Pix</p>
                      <span className="bg-green-100 text-green-700 text-[9px] font-bold rounded-full px-1.5 py-0.5">APROVAÇÃO IMEDIATA</span>
                    </div>
                    <p className="text-[11px] text-foreground/60">Seu pedido é confirmado em segundos. Sem taxas adicionais.</p>
                    {paying && payment === "pix" && (
                      <p className="text-[11px] text-[#FF00BB] font-semibold flex items-center gap-1 mt-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Gerando QR Code...
                      </p>
                    )}
                  </div>
                </button>

                <button onClick={() => setPayment("card")}
                  className={`w-full text-left rounded-xl border-2 p-3 flex items-center gap-3 transition
                    ${payment === "card" ? "border-[#FF00BB] bg-pink-50/40" : "border-pink-100 bg-white"}`}>
                  <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-[#FF00BB]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-[14px]">Cartão de crédito</p>
                    <p className="text-[11px] text-foreground/60">Em até 3x sem juros</p>
                  </div>
                </button>

                {payment === "card" && (
                  <div className="space-y-3 pt-2">
                    <Field label="Número do cartão"><input value={form.cardNumber} onChange={set("cardNumber")} placeholder="0000 0000 0000 0000" className={inputCls} /></Field>
                    <Field label="Nome impresso no cartão"><input value={form.cardName} onChange={set("cardName")} placeholder="Como está no cartão" className={inputCls} /></Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Validade"><input value={form.cardExp} onChange={set("cardExp")} placeholder="MM/AA" className={inputCls} /></Field>
                      <Field label="CVV"><input value={form.cardCvv} onChange={set("cardCvv")} placeholder="000" maxLength={4} className={inputCls} /></Field>
                    </div>
                    <Field label="Parcelas">
                      <select value={form.installments} onChange={set("installments")} className={inputCls}>
                        <option value="1">1x de {formatBRL(total)} sem juros</option>
                        <option value="2">2x de {formatBRL(total / 2)} sem juros</option>
                        <option value="3">3x de {formatBRL(total / 3)} sem juros</option>
                      </select>
                    </Field>
                  </div>
                )}
              </div>
            </section>

            {pix ? (
              <section className="bg-white rounded-2xl shadow-sm border border-pink-100 p-5 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <QrCode className="w-5 h-5 text-[#FF00BB]" />
                  <h3 className="font-extrabold text-foreground">Pague com Pix</h3>
                </div>
                <p className="text-[12px] text-foreground/60 mb-3">Escaneie o QR Code no app do seu banco</p>
                {pix.url ? (
                  <img src={pix.url} alt="QR Code Pix" className="w-56 h-56 mx-auto rounded-lg border border-pink-100" />
                ) : (
                  <img
                    alt="QR Code Pix"
                    className="w-56 h-56 mx-auto rounded-lg border border-pink-100"
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pix.qr)}`}
                  />
                )}
                <div className="mt-4 text-left">
                  <p className="text-[11px] font-bold text-foreground/70 mb-1">Pix copia e cola</p>
                  <div className="flex gap-2">
                    <input readOnly value={pix.qr} className="flex-1 h-10 px-2 rounded-lg border border-pink-200 text-[11px] bg-pink-50/40" />
                    <button onClick={copyPix} className="px-3 h-10 rounded-lg bg-[#FF00BB] text-white text-xs font-bold flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5" /> {copied ? "Copiado" : "Copiar"}
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-[12px] text-foreground/70 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#FF00BB]" />
                  Aguardando confirmação do pagamento...
                </p>
              </section>
            ) : (
              <>
                {payError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{payError}</div>
                )}
                <button onClick={handleFinalize} disabled={paying}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold rounded-full py-3.5 text-sm transition active:scale-[0.99] flex items-center justify-center gap-2 shadow-md">
                  {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  {paying ? "GERANDO PIX..." : "FINALIZAR COMPRA SEGURA"}
                </button>
                <p className="text-center text-[11px] text-foreground/50 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Pagamento 100% seguro
                </p>
              </>
            )}
          </>
        )}

        {/* Step 4: Finalizar */}
        {step === 4 && (
          <section className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>
            <h2 className="font-extrabold text-xl text-foreground">Pagamento confirmado!</h2>
            <p className="text-sm text-foreground/70 mt-1">
              Enviamos os detalhes para <strong>{form.email}</strong>.
            </p>
            <button onClick={() => navigate({ to: "/" })} className="mt-5 w-full bg-[#FF00BB] text-white font-bold rounded-full py-3 text-sm">
              Voltar para a loja
            </button>
          </section>
        )}

        {/* Trust footer */}
        <div className="flex items-center justify-around pt-2 pb-6 text-[11px] text-foreground/60">
          <div className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Compra segura</div>
          <div className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-foreground/70" /> Dados protegidos</div>
          <div className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-green-600" /> Frete Grátis</div>
        </div>
        <p className="text-center text-[10px] text-foreground/40 pb-6 px-6 leading-relaxed">
          Ao continuar, você concorda com os <span className="text-[#FF00BB]">Termos de Uso</span> e <span className="text-[#FF00BB]">Política de Privacidade</span>.
        </p>
      </main>
    </div>
  );
}

const inputCls = "w-full h-11 px-3 rounded-lg border border-pink-200 bg-white text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-[#FF00BB] focus:ring-1 focus:ring-[#FF00BB]/30 transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[12px] font-bold text-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}

function ShipOption({
  selected, onClick, icon, title, badge, desc, price, priceCls,
}: {
  selected: boolean; onClick: () => void; icon: React.ReactNode;
  title: string; badge?: React.ReactNode; desc: string; price: string; priceCls: string;
}) {
  return (
    <button onClick={onClick}
      className={`w-full text-left rounded-xl border-2 p-3 flex items-center gap-3 transition
        ${selected ? "border-[#FF00BB] bg-pink-50/40" : "border-pink-100 bg-white"}`}>
      <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="font-extrabold text-[13px]">{title}</p>
          {badge}
        </div>
        <p className="text-[11px] text-foreground/60">{desc}</p>
      </div>
      <span className={`font-extrabold text-[14px] ${priceCls}`}>{price}</span>
    </button>
  );
}
