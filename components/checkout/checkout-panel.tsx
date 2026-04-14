"use client";

import { useState } from "react";

type CheckoutPanelProps = {
  productKey: string;
  sourcePage: string;
  title: string;
  description: string;
};

export function CheckoutPanel({
  productKey,
  sourcePage,
  title,
  description
}: CheckoutPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCheckout() {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productKey,
          sourcePage
        })
      });

      const data = (await response.json()) as {
        ok: boolean;
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.ok || !data.checkoutUrl) {
        setMessage(data.error ?? "Checkout session could not be created.");
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unexpected checkout error.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="surface-card stack" style={{ padding: "2rem" }}>
      {(title || description) && (
        <div className="stack" style={{ gap: "0.5rem" }}>
          {title && <h2>{title}</h2>}
          {description && <p className="page-lead">{description}</p>}
        </div>
      )}
      <button className="btn btn-primary" disabled={isLoading} onClick={handleCheckout} type="button">
        {isLoading ? "Připravuji checkout..." : "Koupit"}
      </button>
      {message ? <p className="muted">{message}</p> : null}
    </div>
  );
}

