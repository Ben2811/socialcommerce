import Image from "next/image";
import { Heart, Star, User } from "lucide-react";

interface ProductCardProps {
    image: string;
    title: string;
    price: number;
    originalPrice?: number;
    rating: number;
    discount?: number;
    sold?: number;
    author?: string;
}

export function ProductCard({
    image,
    title,
    price,
    originalPrice,
    rating,
    discount,
    sold = 0,
    author = "Unknown",
}: ProductCardProps) {
    return (
        <div className="w-[200px] min-w-[200px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-shrink-0 relative group cursor-pointer hover:shadow-md transition-shadow">
            {discount && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
                    -{discount}%
                </div>
            )}
            <button className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors z-10">
                <Heart className="w-4 h-4" />
            </button>

            <div className="relative h-[180px] w-full bg-gray-100">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="p-3">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
                        {title}
                    </h3>
                    <div className="flex items-center text-[10px] font-medium text-gray-500 flex-shrink-0">
                        <span>{rating}/5</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 ml-0.5" />
                    </div>
                </div>

                <div className="mb-3">
                    <div className="text-red-600 font-bold text-base">
                        {price.toLocaleString('vi-VN')} VND
                    </div>
                    {originalPrice && (
                        <div className="text-gray-400 text-xs line-through decoration-gray-400">
                            {originalPrice.toLocaleString('vi-VN')} VND
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-1.5 max-w-[60%]">
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <User className="w-3 h-3 text-gray-500" />
                        </div>
                        <span className="text-[10px] text-gray-500 truncate">{author}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">Đã bán {sold}</span>
                </div>
            </div>
        </div>
    );
}
