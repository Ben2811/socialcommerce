import { CartItem, CartGroupByShop } from "../types/cart";

export const initialCartItems: CartItem[] = [];

export function groupCartItemsByShop(items: CartItem[]): CartGroupByShop[] {
  const shopMap = new Map<string, CartGroupByShop>();

  for (const item of items) {
    const shopId = item.shopId ?? "default";
    const shopName = item.shopName ?? "Cửa hàng";
    const existing = shopMap.get(shopId);
    if (existing) {
      existing.items.push(item);
    } else {
      shopMap.set(shopId, {
        shopId,
        shopName,
        items: [item],
      });
    }
  }

  return Array.from(shopMap.values());
}
