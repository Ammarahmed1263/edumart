export interface OrderItem {
  id: string;
  title?: string;
  price?: number;
  image?: string;
}

export interface Order {
  items: OrderItem[];
  total: number;
}

export interface CheckoutPayload {
  courseIds: string[];
}

export interface CheckoutResponse {
  status: string;
  data: {
    sessionUrl: string;
  };
}

export interface SessionData {
  orderId: string;
  customerName: string;
  totalAmount: number;
  currency: string;
  items: string[];
  courseIds: string[];
  totalDetails?: {
    amount_discount?: number;
    amount_tax?: number;
    amount_shipping?: number;
  };
}