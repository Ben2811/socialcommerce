import { IMAGES } from "@/features/shared/constants/images";
import { Product } from "../types/product";

export const MOCK_PRODUCTS: Product[] = Array(6).fill({
    id: 1,
    title: "Glorious Grip Tape",
    price: 270000,
    originalPrice: 300000,
    rating: 4.6,
    discount: 10,
    sold: 123,
    author: "Nguyễn Thành Quang",
    image: IMAGES.PRODUCT,
});
