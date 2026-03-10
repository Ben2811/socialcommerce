import { CartItem } from "@/utils/cart";
import { IMAGES } from "@/constants/images";

export const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Áo thun basic trắng",
    price: 199000,
    image: IMAGES.PRODUCT,
    quantity: 2,
  },
  {
    id: 2,
    name: "Quần jean slim fit",
    price: 459000,
    image: IMAGES.PRODUCT,
    quantity: 1,
  },
  {
    id: 3,
    name: "Giày sneaker classic",
    price: 890000,
    image: IMAGES.PRODUCT,
    quantity: 1,
  },
];
