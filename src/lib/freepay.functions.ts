import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API_URL = "https://api.freepaybrasil.com";

const itemSchema = z.object({
  title: z.string().min(1).max(255),
  unit_price: z.number().int().positive(), // centavos
  quantity: z.number().int().positive(),
  tangible: z.boolean(),
});

const createPixSchema = z.object({
  amount: z.number().int().positive(), // centavos
  customer: z.object({
    name: z.string().min(1).max(255),
    email: z.string().email().max(255),
    phone: z.string().min(8).max(20),
    document: z.string().min(11).max(20), // CPF
  }),
  items: z.array(itemSchema).min(1).max(50),
  shipping: z
    .object({
      fee: z.number().int().min(0),
      address: z.object({
        street: z.string().max(255),
        street_number: z.string().max(20),
        complement: z.string().max(255).optional(),
        zip_code: z.string().max(20),
        neighborhood: z.string().max(255),
        city: z.string().max(100),
        state: z.string().max(10),
        country: z.string().max(10).default("BR"),
      }),
    })
    .optional(),
});

function authHeader() {
  const pub = process.env.FREEPAY_PUBLIC_KEY;
  const sec = process.env.FREEPAY_SECRET_KEY;
  if (!pub || !sec) throw new Error("Credenciais FreePay ausentes no servidor.");
  return "Basic " + Buffer.from(`${pub}:${sec}`).toString("base64");
}

export const createFreePayPix = createServerFn({ method: "POST" })
  .inputValidator(createPixSchema)
  .handler(async ({ data }) => {
    const onlyDigits = (s: string) => s.replace(/\D/g, "");
    const cpf = onlyDigits(data.customer.document);

    const body: Record<string, unknown> = {
      amount: data.amount,
      payment_method: "pix",
      postback_url: `${process.env.PUBLIC_APP_URL ?? ""}/api/public/freepay-webhook`,
      customer: {
        name: data.customer.name,
        email: data.customer.email,
        phone: onlyDigits(data.customer.phone),
        document: { number: cpf, type: "cpf" },
      },
      items: data.items,
      pix: { expires_in_days: 1 },
      metadata: { source: "quiosquewepink" },
    };

    if (data.shipping) body.shipping = data.shipping;

    const res = await fetch(`${API_URL}/v1/payment-transaction/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(),
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let json: any;
    try { json = JSON.parse(text); } catch { json = { raw: text }; }

    if (!res.ok) {
      console.error("FreePay error:", res.status, text);
      return {
        ok: false as const,
        error: json?.message || `Falha ao criar transação (${res.status})`,
      };
    }

    // Resposta vem como { data: [ { id, status, pix: [ { qr_code, url, expiration_date } ] } ] }
    const tx = Array.isArray(json?.data) ? json.data[0] : json?.data ?? json;
    const pix = Array.isArray(tx?.pix) ? tx.pix[0] : tx?.pix;

    return {
      ok: true as const,
      id: tx?.id as string,
      status: tx?.status as string,
      qr_code: (pix?.qr_code as string) ?? "",
      qr_url: (pix?.url as string) ?? "",
      expiration_date: pix?.expiration_date as string | undefined,
    };
  });

export const getFreePayTransaction = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1).max(64) }))
  .handler(async ({ data }) => {
    const res = await fetch(`${API_URL}/v1/payment-transaction/info/${encodeURIComponent(data.id)}`, {
      headers: { Authorization: authHeader() },
    });
    const json: any = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false as const, status: "ERROR" };
    return { ok: true as const, status: (json?.status as string) ?? "PENDING" };
  });
