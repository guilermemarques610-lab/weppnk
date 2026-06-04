import { createFileRoute } from "@tanstack/react-router";

// Webhook FreePay — recebe atualizações de status de transação.
// Formato: { Id, Status, Amount, PaymentMethod, PaidAt, ... }
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

        const id = payload?.Id ?? payload?.id;
        const status = payload?.Status ?? payload?.status;
        console.log("[freepay-webhook]", { id, status, method: payload?.PaymentMethod });

        // TODO: persistir status do pedido em banco quando houver tabela de pedidos.
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
