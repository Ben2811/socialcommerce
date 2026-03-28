import { CartItem } from "../types/cart";
import { IMAGES } from "@/features/shared/constants/images";

export const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Laptop MacBook Pro 14",
    price: 39990000,
    image: IMAGES.PRODUCT,
    quantity: 2,
    category: "Laptop",
    shopName: "John Wick",
  },
  {
    id: 2,
    name: "Tai nghe Sony WH-1000XM5",
    price: 11090000,
    image: IMAGES.PRODUCT,
    quantity: 1,
    category: "Âm thanh",
    shopName: "Phát Tấn",
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max",
    price: 18990000,
    image: IMAGES.PRODUCT,
    quantity: 1,
    category: "Điện thoại",
    shopName: "Võ Chí Thông",
  },
  {
    id: 4,
    name: "Apple Watch Series 9",
    price: 8490000,
    image: IMAGES.PRODUCT,
    quantity: 1,
    category: "Đồng hồ thông minh",
    shopName: "Chương Tử Luân",
  },
];
