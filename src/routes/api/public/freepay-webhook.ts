import { createFileRoute } from "@tanstack/react-router";
import { sendUtmifyOrder } from "@/lib/utmify.server";

// Webhook FreePay — recebe atualizações de status de transação.
// FreePay não documenta assinatura HMAC; usamos um shared secret opcional via
// query string (?token=...) configurado em FREEPAY_WEBHOOK_SECRET.

export const Route = createFileRoute("/api/public/freepay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token");
        const expected = process.env.FREEPAY_WEBHOOK_SECRET;
        if (expected && token !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        let payload: any = null;
        try {
          payload = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const id = String(payload?.Id ?? payload?.id ?? payload?.data?.id ?? "");
        const statusRaw = String(payload?.Status ?? payload?.status ?? payload?.data?.status ?? "").toUpperCase();
        console.log("[freepay-webhook]", { id, status: statusRaw });

        // Mapeia status FreePay -> UTMify
        const map: Record<string, "paid" | "refused" | "refunded" | "chargedback" | "waiting_payment"> = {
          PAID: "paid",
          APPROVED: "paid",
          AUTHORIZED: "paid",
          REFUSED: "refused",
          FAILED: "refused",
          CANCELED: "refused",
          CANCELLED: "refused",
          REFUNDED: "refunded",
          CHARGEBACK: "chargedback",
          PENDING: "waiting_payment",
          WAITING_PAYMENT: "waiting_payment",
        };
        const utmStatus = map[statusRaw];

        if (id && utmStatus && utmStatus !== "waiting_payment") {
          const tx = payload?.data ?? payload;
          const amount =
            Number(tx?.Amount ?? tx?.amount ?? tx?.value ?? 0) || 0;
          const customer = tx?.Customer ?? tx?.customer ?? {};
          const itemsRaw: any[] = Array.isArray(tx?.Items)
            ? tx.Items
            : Array.isArray(tx?.items)
              ? tx.items
              : [];
          const paidAt = tx?.PaidAt ?? tx?.paid_at ?? tx?.paidAt;

          await sendUtmifyOrder({
            orderId: id,
            status: utmStatus,
            createdAt: new Date(tx?.CreatedAt ?? tx?.created_at ?? Date.now()),
            approvedDate: utmStatus === "paid" ? new Date(paidAt ?? Date.now()) : null,
            refundedAt: utmStatus === "refunded" ? new Date() : null,
            amountInCents: amount,
            customer: {
              name: customer?.name ?? customer?.Name ?? "Cliente",
              email: customer?.email ?? customer?.Email ?? "sem-email@desconhecido.com",
              phone: customer?.phone ?? customer?.Phone ?? null,
              document:
                customer?.document?.number ??
                customer?.document ??
                customer?.Document ??
                null,
              ip: null,
            },
            products:
              itemsRaw.length > 0
                ? itemsRaw.map((it, idx) => ({
                    id: String(it?.id ?? idx + 1),
                    name: String(it?.title ?? it?.name ?? "Produto"),
                    quantity: Number(it?.quantity ?? 1),
                    priceInCents: Number(it?.unit_price ?? it?.unitPrice ?? amount),
                  }))
                : [
                    {
                      id: "1",
                      name: "Pedido",
                      quantity: 1,
                      priceInCents: amount,
                    },
                  ],
            tracking: null,
          });
        }

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
