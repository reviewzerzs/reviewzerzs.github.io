export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price_per_unit: number;
  currency_symbol: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_UgaSTHawJkTgnl',
    priceId: 'price_1ThDHKAc3JKjYpyVWnmD789T',
    name: 'Reviews',
    description: 'Professional review services for your business',
    price_per_unit: 0, // Will be fetched from Stripe
    currency_symbol: '$',
    mode: 'payment',
  },
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};