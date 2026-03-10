import { Bolt } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { IMAGES } from "@/constants/images";


const MOCK_PRODUCTS = Array(6).fill({
    title: "Glorious Grip Tape",
    price: 270000,
    originalPrice: 300000,
    rating: 4.6,
    discount: 10,
    sold: 123,
    author: "Nguyễn Thành Quang",
    image: IMAGES.PRODUCT,
});

export function FlashSale() {
    return (
        <div className="my-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Bolt className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-red-500 uppercase">FLASH SALE</h2>
                    <div className="hidden md:flex items-center gap-2 text-2xl font-bold text-gray-800">
                        <span>02</span>:<span>45</span>:<span>12</span>
                    </div>
                </div>

                <button className="text-yellow-500 font-bold hover:underline">
                    Xem Tất Cả Deal
                </button>
            </div>
            <div className="flex gap-8 items-center justify-center overflow-x-auto pb-4 scrollbar-hide py-2">
                {MOCK_PRODUCTS.map((product, index) => (
                    <ProductCard key={index} {...product} />
                ))}
            </div>
        </div>
    );
}
