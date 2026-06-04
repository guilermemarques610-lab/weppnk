// UTMify integration — server-only helper.
// Docs: https://docs.utmify.com.br/

type UtmifyStatus = "waiting_payment" | "paid" | "refused" | "refunded" | "chargedback";

export type UtmifyTracking = {
  src?: string | null;
  sck?: string | null;
  utm_source?: string | null;
  utm_campaign?: string | null;
  utm_medium?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
};

export type UtmifyCustomer = {
  name: string;
  email: string;
  phone?: string | null;
  document?: string | null;
  ip?: string | null;
};

export type UtmifyProduct = {
  id: string;
  name: string;
  quantity: number;
  priceInCents: number;
  planId?: string | null;
  planName?: string | null;
};

export type UtmifyOrderInput = {
  orderId: string;
  status: UtmifyStatus;
  createdAt: Date;
  approvedDate?: Date | null;
  refundedAt?: Date | null;
  amountInCents: number;
  customer: UtmifyCustomer;
  products: UtmifyProduct[];
  tracking?: UtmifyTracking | null;
  isTest?: boolean;
};

// UTMify exige datas em UTC no formato "YYYY-MM-DD HH:mm:ss"
function fmtDate(d: Date | null | undefined): string | null {
  if (!d) return null;
  const iso = d.toISOString(); // 2025-01-01T12:34:56.000Z
  return iso.slice(0, 10) + " " + iso.slice(11, 19);
}

export async function sendUtmifyOrder(input: UtmifyOrderInput): Promise<void> {
  const token = process.env.UTMIFY_API_TOKEN;
  if (!token) {
    console.warn("[utmify] UTMIFY_API_TOKEN ausente — pulando notificação");
    return;
  }

  const body = {
    orderId: input.orderId,
    platform: "GatewayPix",
    paymentMethod: "pix",
    status: input.status,
    createdAt: fmtDate(input.createdAt),
    approvedDate: fmtDate(input.approvedDate ?? null),
    refundedAt: fmtDate(input.refundedAt ?? null),
    customer: {
      name: input.customer.name,
      email: input.customer.email,
      phone: input.customer.phone ?? null,
      document: input.customer.document ?? null,
      country: "BR",
      ip: input.customer.ip ?? null,
    },
    products: input.products.map((p) => ({
      id: p.id,
      name: p.name,
      planId: p.planId ?? null,
      planName: p.planName ?? null,
      quantity: p.quantity,
      priceInCents: p.priceInCents,
    })),
    trackingParameters: {
      src: input.tracking?.src ?? null,
      sck: input.tracking?.sck ?? null,
      utm_source: input.tracking?.utm_source ?? null,
      utm_campaign: input.tracking?.utm_campaign ?? null,
      utm_medium: input.tracking?.utm_medium ?? null,
      utm_content: input.tracking?.utm_content ?? null,
      utm_term: input.tracking?.utm_term ?? null,
    },
    commission: {
      totalPriceInCents: input.amountInCents,
      gatewayFeeInCents: 0,
      userCommissionInCents: input.amountInCents,
    },
    isTest: input.isTest ?? false,
  };

  try {
    const res = await fetch("https://api.utmify.com.br/api-credentials/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": token,
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error("[utmify] falha", res.status, text);
    } else {
      console.log("[utmify] ok", input.status, input.orderId);
    }
  } catch (err) {
    console.error("[utmify] erro de rede:", err);
  }
}
