import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Menu, Search, User, ShoppingCart, Plus, ShoppingCart as Cart, MapPin, Truck, Store, Sparkles, Gift } from "lucide-react";
import img_banner_realeza_LSTGtm9g from "@/assets/banners/banner-realeza-LSTGtm9g.webp";
import img_banner_namorados_CvCyTe41 from "@/assets/banners/banner-namorados-CvCyTe41.webp";
import img_banner_kit_promocional_wBZfTgpx from "@/assets/banners/banner-kit-promocional-wBZfTgpx.webp";
import img_banner_namorados_2_CkI0VjEO from "@/assets/banners/banner-namorados-2-CkI0VjEO.webp";
import img_banner_kits_dos_sonhos_CXzpMOTN from "@/assets/banners/banner-kits-dos-sonhos-CXzpMOTN.webp";
import img_kit_eternal_red from "@/assets/products/kit-eternal-red.webp";
import img_kit_duo_sonhos_reais from "@/assets/products/kit-duo-sonhos-reais.png";
import img_kit_essencia_de_rica_5_body_splash from "@/assets/products/kit-essencia-de-rica-5-body-splash.webp";
import img_kit_vanilla_5_body_splash from "@/assets/products/kit-vanilla-5-body-splash.webp";
import img_kit_trio_gemas_reais from "@/assets/products/kit-trio-gemas-reais.webp";
import img_kit_cheiro_de_rica_deluxe from "@/assets/products/kit-cheiro-de-rica-deluxe.webp";
import img__164301_800_auto from "@/assets/products/164301-800-auto";
import img__164092_800_auto from "@/assets/products/164092-800-auto";
import img__164408_800_auto from "@/assets/products/164408-800-auto";
import img__164407_800_auto from "@/assets/products/164407-800-auto";
import img__164409_800_auto from "@/assets/products/164409-800-auto";
import img__164405_800_auto from "@/assets/products/164405-800-auto";
import img__160993_800_auto from "@/assets/products/160993-800-auto";
import img__164336_800_auto from "@/assets/products/164336-800-auto";
import img__162800_800_auto from "@/assets/products/162800-800-auto";
import img__04 from "@/assets/products/04.jpg";
import img__164758_800_auto from "@/assets/products/164758-800-auto";
import img_Fatal_Black_For_Her_Desodorante_Colonia_100ml_1 from "@/assets/products/Fatal-Black-For-Her-Desodorante-Colonia-100ml_1.webp";
import img__3__1_ from "@/assets/products/3--1-.webp";
import img__161463_1200_auto from "@/assets/products/161463-1200-auto.webp";
import img_red_perfume from "@/assets/products/red-perfume.png";
import img_Prancheta_3__4_ from "@/assets/products/Prancheta-3--4-.webp";
import img_Prancheta_203 from "@/assets/products/Prancheta%203.webp";
import img__161458_1200_auto from "@/assets/products/161458-1200-auto.webp";
import img_Scarlette_Desodorante_Colonia_50ml_1 from "@/assets/products/Scarlette-Desodorante-Colonia-50ml_1.webp";
import img_Serum_PDRN_7 from "@/assets/products/Serum_PDRN-7.jpg";
import img_Perfect_Pear_1_jpg from "@/assets/products/Perfect-Pear-1.jpg.jpg";
import img_booster_1_jpg from "@/assets/products/booster-1.jpg.jpg";
import img__162495_800_auto from "@/assets/products/162495-800-auto";
import img__163931_800_auto from "@/assets/products/163931-800-auto";
import img_Heaven_20Blue_203 from "@/assets/products/Heaven%20Blue%203.webp";
import img__164322_800_auto from "@/assets/products/164322-800-auto";
import img__164327_800_auto from "@/assets/products/164327-800-auto";
import img__164222_800_auto from "@/assets/products/164222-800-auto";
import img__163578_800_auto from "@/assets/products/163578-800-auto";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Quiosques WePink — Promoção Dia dos Namorados até 85% OFF" },
    { name: "description", content: "Kits WePink com até 85% OFF nos Quiosques WePink. Concorra a um iPhone 17 Pro Max." },
  ] }),
  component: Home,
});

const BANNERS = [
  { src: img_banner_realeza_LSTGtm9g, alt: "Kit Duo Realeza" },
  { src: img_banner_namorados_CvCyTe41, alt: "Kits para namorados" },
  { src: img_banner_kit_promocional_wBZfTgpx, alt: "Kit promocional" },
  { src: img_banner_namorados_2_CkI0VjEO, alt: "Kits para namorados" },
  { src: img_banner_kits_dos_sonhos_CXzpMOTN, alt: "Kits dos sonhos" },
];

const SECTIONS: { title: string; products: any[] }[] = [
  { title: "🎁 kits queridinhos", products: [
    { title: "KIT DUO REALEZA – Eternal Cherish + Red - Wepink", desc: "dupla icônica: Eternal Cherish dourado + Red marcante.", img: img_kit_eternal_red, oldPrice: "R$ 459,80", newPrice: "R$ 68,97", installment: "ou 6x R$ 11,50", discount: "85", badge: "exclusivo" },
    { title: "KIT ÂMBAR & AMETISTA – Yahya Sadeeq + Tyrie Royale - Wepink", desc: "dupla majestosa: Yahya Sadeeq oriental + Tyrie Royale exuberante.", img: img_kit_duo_sonhos_reais, oldPrice: "R$ 469,00", newPrice: "R$ 78,59", installment: "ou 6x R$ 13,10", discount: "80", badge: "exclusivo" },
    { title: "KIT ESSÊNCIA DE RICA – 5 Body Splash Wepink Exclusivos", desc: "5 body splashes: Liberté, Obsessed, Golden, Infinity e Onetouch Warm.", img: img_kit_essencia_de_rica_5_body_splash, oldPrice: "R$ 319,27", newPrice: "R$ 47,89", installment: "ou 6x R$ 7,98", discount: "85", badge: "exclusivo" },
    { title: "Kit Vanilla Exclusivo – 5 Body Splash Wepink", desc: "5 body splashes vanilla: cuddle, hope, dream, wish e hug.", img: img_kit_vanilla_5_body_splash, oldPrice: "R$ 389,00", newPrice: "R$ 38,90", installment: "ou 6x R$ 6,48", discount: "80", badge: "exclusivo" },
    { title: "KIT TRIO GEMAS REAIS – Ruby Rhodolite + Obsessed + Heaven Blue - Wepink", desc: "trio de joias olfativas: Ruby Rhodolite, Obsessed e Heaven Blue.", img: img_kit_trio_gemas_reais, oldPrice: "R$ 657,27", newPrice: "R$ 98,59", installment: "ou 6x R$ 16,43", discount: "85", badge: "exclusivo" },
    { title: "KIT CHEIRO DE RICA Deluxe – Ruby + Heaven Blue + VF Golden - Wepink", desc: "trio premium: Ruby Rhodolite, Heaven Blue e VF Golden.", img: img_kit_cheiro_de_rica_deluxe, oldPrice: "R$ 657,27", newPrice: "R$ 98,59", installment: "ou 6x R$ 16,43", discount: "85", badge: "deluxe" },
    { title: "Kit Body Splash Mother Extraordinaire - Wepink", desc: "um kit criado para celebrar as muitas formas de ser mãe.", img: img__164301_800_auto, oldPrice: "R$ 224,55", newPrice: "R$ 44,91", installment: "ou 6x R$ 7,48", discount: "80", badge: "exclusivo" },
    { title: "Kit Body Splash Universe Edição Limitada - Wepink", desc: "edição limitada universe: fragrâncias que despertam emoções.", img: img__164092_800_auto, oldPrice: "R$ 199,90", newPrice: "R$ 39,98", installment: "ou 6x R$ 6,66", discount: "80", badge: "edi\u00e7\u00e3o limitada" },
    { title: "Kit VF Golden + Body Splash Latina + Espuma de Banho Vanilla Dream - Wepink", desc: "trio dourado: perfume sofisticado, body splash e espuma.", img: img__164408_800_auto, oldPrice: "R$ 543,90", newPrice: "R$ 81,59", installment: "ou 6x R$ 13,60", discount: "85", badge: "kit" },
    { title: "Kit One Touch Latte + Body Splash Latina + Espuma de Banho Vanilla Dream - Wepink", desc: "trio queridinho: perfume, body splash e espuma de banho.", img: img__164407_800_auto, oldPrice: "R$ 543,90", newPrice: "R$ 81,59", installment: "ou 6x R$ 13,60", discount: "85", badge: "kit" },
    { title: "Kit Latina + Body Splash Latina + Espuma de Banho Vanilla Dream - Wepink", desc: "a experiência Latina completa com bônus de banho.", img: img__164409_800_auto, oldPrice: "R$ 543,90", newPrice: "R$ 81,59", installment: "ou 6x R$ 13,60", discount: "85", badge: "kit" },
    { title: "Kit VF Choices Delight + Body Cream Vanilla Hug + Espuma de Banho Vanilla Hug - Wepink", desc: "perfume floral frutado + hidratante + espuma vanilla hug.", img: img__164405_800_auto, oldPrice: "R$ 463,00", newPrice: "R$ 87,50", installment: "ou 6x R$ 14,58", discount: "80", badge: "kit" },
  ]},
  { title: "os mais vendidos", products: [
    { title: "Body Splash Liberté Doré Desodorante Colônia 200ml - Wepink", desc: "você vale ouro! a luz dourada da liberdade em fragrância.", img: img__160993_800_auto, oldPrice: "R$ 115,00", newPrice: "R$ 23,00", installment: "ou 6x R$ 3,83", discount: "80", badge: "best seller" },
    { title: "Body Splash Latina Desodorante Colônia 200ml - Wepink", desc: "a intensidade tropical com sofisticação envolvente.", img: img__164336_800_auto, oldPrice: "R$ 115,00", newPrice: "R$ 23,00", installment: "ou 6x R$ 3,83", discount: "80", badge: "best seller" },
    { title: "Body Splash Obsessed Desodorante Colônia 200ml - Wepink", desc: "essência mágica e elegante, ousadia em pele perfumada.", img: img__162800_800_auto, oldPrice: "R$ 115,00", newPrice: "R$ 23,00", installment: "ou 6x R$ 3,83", discount: "80", badge: "best seller" },
    { title: "Body Splash Heaven Bride Desodorante Colônia 200ml - Wepink", desc: "um convite divino para se sentir noiva todos os dias.", img: img__04, oldPrice: "R$ 115,00", newPrice: "R$ 23,00", installment: "ou 6x R$ 3,83", discount: "80", badge: "best seller" },
    { title: "Body Splash Infinity Desodorante Colônia 200ml - Wepink", desc: "transmita determinação da melhor forma.", img: img__164758_800_auto, oldPrice: "R$ 115,00", newPrice: "R$ 23,00", installment: "ou 6x R$ 3,83", discount: "80", badge: "best seller" },
    { title: "Fatal Black For Her Desodorante Colônia 100ml - Wepink", desc: "fragrância marcante e sedutora para mulheres fatais.", img: img_Fatal_Black_For_Her_Desodorante_Colonia_100ml_1, oldPrice: "", newPrice: "", installment: "", discount: null, badge: "best seller" },
  ]},
  { title: "queridinhos da wepink", products: [
    { title: "Latina Desodorante Colônia 100ml - Wepink", desc: "a fragrância que traduz o calor e a sensualidade latina.", img: img__3__1_, oldPrice: "R$ 239,45", newPrice: "R$ 47,89", installment: "ou 6x R$ 7,98", discount: "80", badge: "best seller" },
    { title: "Body Splash Obsessed Intense Desodorante Colônia 200ml - Wepink", desc: "obsessão em forma de fragrância: intensa e envolvente.", img: img__161463_1200_auto, oldPrice: "R$ 114,50", newPrice: "R$ 22,90", installment: "ou 6x R$ 3,82", discount: "80", badge: "best seller" },
    { title: "Red Desodorante Colônia 100ml - Wepink", desc: "o aroma que desperta sempre o melhor em você.", img: img_red_perfume, oldPrice: "R$ 247,45", newPrice: "R$ 49,49", installment: "ou 6x R$ 8,25", discount: "80", badge: "best seller" },
    { title: "Shower Dream Espuma de Banho Vanilla Dream 150ml - Wepink", desc: "aconchego e limpeza em uma textura de chantilly com o cheirinho do vanilla dream", img: img_Prancheta_3__4_, oldPrice: "R$ 99,90", newPrice: "R$ 19,98", installment: "ou 6x R$ 3,33", discount: "80", badge: "lan\u00e7amento" },
  ]},
  { title: "✨ destaque do mês", products: [
    { title: "Body Cream Vanilla Hug Desodorante Hidratante 200ml - Wepink", desc: "nutrição profunda em um abraço acolhedor.", img: img_Prancheta_203, oldPrice: "R$ 115,00", newPrice: "R$ 23,00", installment: "ou 6x R$ 3,83", discount: "80", badge: null },
    { title: "Body Splash Fatal Black For Her Desodorante Colônia 200ml - Wepink", desc: "frescor sedutor com notas marcantes e envolventes.", img: img__161458_1200_auto, oldPrice: "R$ 89,90", newPrice: "R$ 17,98", installment: "ou 6x R$ 3,00", discount: "80", badge: null },
    { title: "Scarlette Desodorante Colônia 50ml - Wepink", desc: "uma fragrância marcante e sofisticada para o dia a dia.", img: img_Scarlette_Desodorante_Colonia_50ml_1, oldPrice: "R$ 159,00", newPrice: "R$ 31,80", installment: "ou 6x R$ 5,30", discount: "80", badge: "best seller" },
    { title: "Sérum PDRN 30ml - Wepink", desc: "tecnologia coreana de regeneração celular para a pele.", img: img_Serum_PDRN_7, oldPrice: "R$ 199,00", newPrice: "R$ 39,80", installment: "ou 6x R$ 6,63", discount: "80", badge: "novidade" },
    { title: "Body Splash VF Golden Desodorante Colônia 200ml - Wepink", desc: "elegância dourada em uma fragrância irresistível.", img: img__04, oldPrice: "R$ 89,90", newPrice: "R$ 17,98", installment: "ou 6x R$ 3,00", discount: "80", badge: null },
    { title: "Perfect Pear Desodorante Colônia 100ml - Wepink", desc: "o frescor doce e marcante da pera, com toque sofisticado.", img: img_Perfect_Pear_1_jpg, oldPrice: "R$ 169,00", newPrice: "R$ 33,80", installment: "ou 6x R$ 5,63", discount: "80", badge: "queridinho" },
    { title: "Booster Repair Óleo Capilar 30ml - Wepink", desc: "óleo capilar reparador para fios sedosos e brilhantes.", img: img_booster_1_jpg, oldPrice: "R$ 149,00", newPrice: "R$ 29,80", installment: "ou 6x R$ 4,97", discount: "80", badge: "best seller" },
    { title: "Ruby Desodorante Colônia 100ml - Wepink", desc: "o encanto exclusivo de uma essência valiosa.", img: img__162495_800_auto, oldPrice: "R$ 329,00", newPrice: "R$ 45,89", installment: "ou 6x R$ 7,65", discount: "80", badge: null },
    { title: "Yahya Sadeeq Desodorante Colônia 100ml - Wepink", desc: "mergulhe neste mundo místico de madeira e âmbar.", img: img__163931_800_auto, oldPrice: "R$ 329,00", newPrice: "R$ 45,89", installment: "ou 6x R$ 7,65", discount: "80", badge: null },
    { title: "Heaven Blue Desodorante Colônia 100ml - Wepink", desc: "a paz do paraíso em uma fragrância fresca e marcante.", img: img_Heaven_20Blue_203, oldPrice: "R$ 329,00", newPrice: "R$ 45,89", installment: "ou 6x R$ 7,65", discount: "80", badge: "best seller" },
    { title: "VF Choices Delight Desodorante Colônia 100ml - Wepink", desc: "o floral frutado fresco que é a escolha certa para você.", img: img__164322_800_auto, oldPrice: "R$ 329,00", newPrice: "R$ 47,98", installment: "ou 6x R$ 8,00", discount: "80", badge: "lan\u00e7amento" },
    { title: "Tyrie Royale Desodorante Colônia 100ml - Wepink", desc: "um oriental frutado que combina feminilidade com personalidade.", img: img__164327_800_auto, oldPrice: "R$ 329,00", newPrice: "R$ 54,90", installment: "ou 6x R$ 9,15", discount: "80", badge: "lan\u00e7amento" },
    { title: "Verano Di Capri Desodorante Colônia 100ml - Wepink", desc: "frescor luminoso do verão com uma doçura irresistível.", img: img__164222_800_auto, oldPrice: "R$ 329,00", newPrice: "R$ 47,98", installment: "ou 6x R$ 8,00", discount: "80", badge: null },
    { title: "Ruby Rhodolite Desodorante Colônia 100ml - Wepink", desc: "lapidado para impactar!", img: img__163578_800_auto, oldPrice: "R$ 329,00", newPrice: "R$ 48,68", installment: "ou 6x R$ 8,11", discount: "80", badge: "best seller" },
  ]},
];


function ProductCard({ p }: { p: any }) {
  return (
    <article className="flex flex-col">
      <div className="relative bg-white rounded-md overflow-hidden aspect-square flex items-center justify-center">
        {p.discount && (
          <span className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-wide rounded-full px-2 py-1 shadow">
            -{p.discount}%
          </span>
        )}
        {p.badge && (
          <span className="absolute top-2 left-2 z-10 bg-yellow-400 text-[10px] font-bold uppercase tracking-wide text-foreground rounded-full px-2 py-1 shadow">
            {p.badge}
          </span>
        )}
        <img src={p.img} alt={p.title} loading="lazy" className="w-full h-full object-contain p-2" />
      </div>
      <h3 className="mt-3 text-[13px] font-bold leading-snug text-foreground line-clamp-3">{p.title}</h3>
      <p className="mt-1 text-[12px] text-foreground/80 leading-snug line-clamp-2">{p.desc}</p>
      <p className="mt-2 text-[12px] text-muted-foreground line-through">{p.oldPrice}</p>
      <p className="mt-0.5 text-[14px] font-bold text-primary">
        {p.newPrice} <span className="text-[11px] font-normal text-foreground/70">{p.installment}</span>
      </p>
      <div className="mt-3 flex items-stretch gap-2">
        <button className="flex-1 bg-primary text-primary-foreground font-bold text-sm rounded-md py-2.5 active:scale-[0.98] transition">Comprar</button>
        <button aria-label="Adicionar ao carrinho" className="border-2 border-primary text-primary rounded-md px-2.5 flex items-center gap-0.5">
          <Plus className="w-3.5 h-3.5" strokeWidth={3} />
          <Cart className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}

function Home() {
  const [bannerIdx, setBannerIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setBannerIdx((i) => {
        const next = (i + 1) % BANNERS.length;
        scrollRef.current?.scrollTo({ left: next * (scrollRef.current?.clientWidth ?? 0), behavior: "smooth" });
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const goTo = (i: number) => {
    setBannerIdx(i);
    scrollRef.current?.scrollTo({ left: i * (scrollRef.current?.clientWidth ?? 0), behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background mx-auto max-w-md md:shadow-xl">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background border-b border-border">
        <div className="flex items-center justify-between px-3 py-3">
          <button aria-label="Menu" className="p-2"><Menu className="w-6 h-6 text-foreground" /></button>
          <div className="text-2xl font-extrabold text-primary lowercase tracking-tight">wepink</div>
          <div className="flex items-center gap-1">
            <button aria-label="Buscar" className="p-2"><Search className="w-5 h-5 text-foreground" /></button>
            <button aria-label="Conta" className="p-2"><User className="w-5 h-5 text-foreground" /></button>
            <button aria-label="Carrinho" className="p-2"><ShoppingCart className="w-5 h-5 text-foreground" /></button>
          </div>
        </div>
      </header>

      <main>
        {/* Banner carousel */}
        <section className="relative">
          <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: "none" }}>
            {BANNERS.map((b, i) => (
              <button key={i} type="button" className="min-w-full snap-center block text-left active:opacity-90 transition" aria-label={b.alt}>
                <img src={b.src} alt={b.alt} className="w-full h-auto block" loading={i===0?"eager":"lazy"} />
              </button>
            ))}
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {BANNERS.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Ir ao banner ${i+1}`} className={`h-2 rounded-full transition-all ${i===bannerIdx?"w-6 bg-primary":"w-2 bg-foreground/30"}`} />
            ))}
          </div>
        </section>

        {/* CEP card */}
        <section className="px-4 mt-6">
          <div className="bg-gradient-to-br from-[#FF00BB]/10 via-[#FF00BB]/5 to-transparent border border-[#FF00BB]/20 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-md shadow-primary/30">
              <Gift className="w-5 h-5" />
            </div>
            <div className="text-xs leading-snug">
              <p className="font-extrabold text-foreground">Comprou? Já está concorrendo 🎁</p>
              <p className="text-foreground/80 mt-1">Na compra de <span className="font-extrabold text-primary">qualquer produto</span>, você ganha <span className="font-extrabold text-primary">1 número da sorte</span> para concorrer a um <span className="font-extrabold text-foreground underline decoration-primary decoration-2 underline-offset-2">iPhone 17 Pro Max</span> ✨</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <MapPin className="w-7 h-7 text-primary flex-shrink-0" strokeWidth={2.5} />
            <p className="text-sm font-extrabold lowercase">digite seu cep e encontre um quiosque <span className="text-primary">wepink</span> mais perto de você</p>
          </div>
          <form className="mt-3 space-y-3" onSubmit={(e)=>e.preventDefault()}>
            <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Seu CEP</label>
            <div className="flex gap-2 w-full">
              <input inputMode="numeric" placeholder="00000-000" className="flex-1 min-w-0 border-2 border-border rounded-xl px-3 py-3 text-base font-semibold focus:outline-none focus:border-primary transition" />
              <button type="submit" className="shrink-0 bg-primary text-primary-foreground font-bold rounded-xl px-4 py-3 text-sm active:scale-[0.97] transition">Buscar</button>
            </div>
            <span className="block text-xs text-foreground/40">Não sei meu CEP</span>
            <div className="mt-2 grid grid-cols-3 gap-2 pt-3 border-t border-border">
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Truck className="w-4 h-4" /></div>
                <span className="text-[10px] font-semibold text-foreground/70">Mesmo dia</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Store className="w-4 h-4" /></div>
                <span className="text-[10px] font-semibold text-foreground/70">+200 quiosques</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
                <span className="text-[10px] font-semibold text-foreground/70">Frete Grátis*</span>
              </div>
            </div>
          </form>
        </section>

        {/* Sections */}
        {SECTIONS.map((sec) => (
          <div key={sec.title} className="scroll-mt-20">
            <h2 className="text-primary font-extrabold text-3xl lowercase text-center px-4 mt-8 mb-6 leading-tight tracking-tight">{sec.title}</h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-3">
              {sec.products.map((p, i) => <ProductCard key={i} p={p} />)}
            </div>
          </div>
        ))}

        <footer className="mt-12 px-4 py-8 bg-foreground/[0.03] text-center text-xs text-foreground/60">
          <p className="font-bold text-primary text-base lowercase mb-2">wepink</p>
          <p>Quiosques WePink — Oferta Dia dos Namorados</p>
          <p className="mt-2">© {new Date().getFullYear()} — Todos os direitos reservados</p>
        </footer>
      </main>
    </div>
  );
}
