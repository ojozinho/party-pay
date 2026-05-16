import React from 'react';
import { Product, products as seedProducts } from '../data/mockProducts';
import { Locale } from '../i18n';

export type Role = 'guest' | 'customer' | 'bartender' | 'admin';
export type OrderStatus = 'paid' | 'preparing' | 'ready' | 'delivered';

export type CartItem = { productId: string; qty: number };
export type Order = {
  id: string;
  customer: string;
  items: CartItem[];
  total: number;
  fee: number;
  payout: number;
  status: OrderStatus;
  token: string;
  tokenUsed: boolean;
  createdAt: string;
};

type State = {
  role: Role;
  locale: Locale;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  selectedProductId?: string;
  lastScan?: 'valid' | 'used' | 'invalid';
};

type Actions = {
  setRole: (role: Role) => void;
  toggleLocale: () => void;
  selectProduct: (id: string) => void;
  addToCart: (id: string, qty?: number) => void;
  changeQty: (id: string, delta: number) => void;
  clearCart: () => void;
  createPaidOrder: () => Order | undefined;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  scanToken: (token?: string) => void;
  toggleProduct: (id: string) => void;
  addMockProduct: () => void;
};

const initialOrders: Order[] = [
  {
    id: '#7421',
    customer: 'Lucas R.',
    items: [
      { productId: 'caipirinha', qty: 2 },
      { productId: 'beer', qty: 2 },
      { productId: 'combo', qty: 1 }
    ],
    total: 111.9,
    fee: 5.6,
    payout: 106.3,
    status: 'ready',
    token: 'PP-PV7421-LUCAS',
    tokenUsed: false,
    createdAt: '23:47'
  },
  {
    id: '#7427',
    customer: 'Bia F.',
    items: [{ productId: 'gin', qty: 2 }],
    total: 56,
    fee: 2.8,
    payout: 53.2,
    status: 'preparing',
    token: 'PP-PV7427-BIA',
    tokenUsed: false,
    createdAt: '23:52'
  }
];

const StoreContext = React.createContext<(State & Actions) | null>(null);

export function PartyPayProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>({
    role: 'guest',
    locale: 'pt-BR',
    products: seedProducts,
    cart: [],
    orders: initialOrders
  });

  const actions = React.useMemo<Actions>(() => ({
    setRole: (role) => setState((s) => ({ ...s, role })),
    toggleLocale: () => setState((s) => ({ ...s, locale: s.locale === 'pt-BR' ? 'en-US' : 'pt-BR' })),
    selectProduct: (id) => setState((s) => ({ ...s, selectedProductId: id })),
    addToCart: (id, qty = 1) => setState((s) => {
      const exists = s.cart.find((item) => item.productId === id);
      return {
        ...s,
        cart: exists
          ? s.cart.map((item) => item.productId === id ? { ...item, qty: item.qty + qty } : item)
          : [...s.cart, { productId: id, qty }]
      };
    }),
    changeQty: (id, delta) => setState((s) => ({
      ...s,
      cart: s.cart
        .map((item) => item.productId === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item)
        .filter((item) => item.qty > 0)
    })),
    clearCart: () => setState((s) => ({ ...s, cart: [] })),
    createPaidOrder: () => {
      let created: Order | undefined;
      setState((s) => {
        const total = s.cart.reduce((sum, item) => {
          const product = s.products.find((p) => p.id === item.productId);
          return sum + (product?.price ?? 0) * item.qty;
        }, 0);
        if (!s.cart.length || !total) return s;
        const fee = Number((total * 0.05).toFixed(2));
        created = {
          id: `#${7428 + s.orders.length}`,
          customer: 'Você',
          items: s.cart,
          total,
          fee,
          payout: Number((total - fee).toFixed(2)),
          status: 'paid',
          token: `PP-PV${Date.now().toString().slice(-5)}-VOCE`,
          tokenUsed: false,
          createdAt: 'agora'
        };
        return { ...s, cart: [], orders: [created, ...s.orders] };
      });
      return created;
    },
    setOrderStatus: (id, status) => setState((s) => ({
      ...s,
      orders: s.orders.map((order) => order.id === id ? { ...order, status } : order)
    })),
    scanToken: (token) => setState((s) => {
      const candidate = token ? s.orders.find((order) => order.token === token) : s.orders[0];
      if (!candidate) return { ...s, lastScan: 'invalid' };
      if (candidate.tokenUsed) return { ...s, lastScan: 'used' };
      return {
        ...s,
        lastScan: 'valid',
        orders: s.orders.map((order) => order.id === candidate.id ? { ...order, status: 'delivered', tokenUsed: true } : order)
      };
    }),
    toggleProduct: (id) => setState((s) => ({
      ...s,
      products: s.products.map((product) => product.id === id ? { ...product, available: !product.available } : product)
    })),
    addMockProduct: () => setState((s) => ({
      ...s,
      products: [...s.products, {
        id: `shot-${s.products.length}`,
        name: 'Shot neon da casa',
        enName: 'House neon shot',
        category: 'shots',
        price: 14,
        description: 'Shot cítrico criado no painel admin demo.',
        image: require('../assets/products/cocktail.jpg'),
        tint: '#B8FF4D',
        available: true,
        tag: 'novo'
      }]
    }))
  }), []);

  return <StoreContext.Provider value={{ ...state, ...actions }}>{children}</StoreContext.Provider>;
}

export function usePartyPay() {
  const value = React.useContext(StoreContext);
  if (!value) throw new Error('usePartyPay must be used inside PartyPayProvider');
  return value;
}

export function money(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
