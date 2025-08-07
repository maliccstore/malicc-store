'use client';

import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';

export default function CheckoutPage() {
  const items = useAppSelector((state) => state.cart.items);

  const handleCheckout = async () => {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
    const session = await response.json();

    if (session.id) {
      window.location.href = session.url; // Redirect directly using session URL
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <Button onClick={handleCheckout}>Proceed to Payment</Button>
    </div>
  );
}
