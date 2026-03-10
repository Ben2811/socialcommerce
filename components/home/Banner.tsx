import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { IMAGES } from "@/constants/images";

export function Banner() {
    return (
        <div className="relative w-full h-[400px] bg-gray-900 overflow-hidden rounded-2xl my-6">
            <div className="absolute inset-0 z-0">
                <Image
                    src={IMAGES.BANNER}
                    alt="Tech Revolution Banner"
                    fill
                    className="object-cover opacity-80"
                    priority
                />
            </div>

            <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 max-w-2xl">
                <h1 className="text-5xl font-bold text-white mb-2 leading-tight">
                    TECH <br />
                    <span className="text-purple-500">REVOLUTION</span>
                </h1>
                <p className="text-gray-200 text-lg mb-8">
                    Săn ngay loạt deal công nghệ đỉnh cao giảm đến 50%.
                </p>
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors w-fit"
                >
                    Mua Sắm Ngay
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
