export type CartLine = {
  key: string;
  id: string;
  name: string;
  size?: string;
  unitPrice: number;
  qty: number;
  img?: string;
};

export type OrderType = "delivery" | "pickup";

export type OrderData = {
  orderNo: string;
  serial: number;
  placedAt: string;
  placedAtISO: string;
  people: string;
  qr?: string;
  name: string;
  phone: string;
  altPhone: string;
  orderType: OrderType;
  area: string;
  address: string;
  landmark: string;
  building: string;
  floor: string;
  apartment: string;
  when: string;
  timeSlot: string;
  payment: string;
  notes: string;
  lines: CartLine[];
  subtotal: number;
  deliveryFee: number;
  vat: number;
  total: number;
  eta: string;
};
