import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/constants/images";



export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="md:col-span-1">
                        <h3 className="text-xl font-bold mb-4">Nav bar</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Shop</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-black transition-colors">Kênh bán hàng</Link></li>
                            <li><Link href="#" className="hover:text-black transition-colors">Tính năng</Link></li>
                            <li><Link href="#" className="hover:text-black transition-colors">Quảng cáo</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Shop</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-black transition-colors">Kênh bán hàng</Link></li>
                            <li><Link href="#" className="hover:text-black transition-colors">Tính năng</Link></li>
                            <li><Link href="#" className="hover:text-black transition-colors">Quảng cáo</Link></li>
                            <li><Link href="#" className="hover:text-black transition-colors">Quảng cáo</Link></li>
                            <li><Link href="#" className="hover:text-black transition-colors">Quảng cáo</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">About</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-black transition-colors">Kênh bán hàng</Link></li>
                            <li><Link href="#" className="hover:text-black transition-colors">Tính năng</Link></li>
                            <li><Link href="#" className="hover:text-black transition-colors">Quảng cáo</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">

                    <div className="flex gap-6 text-sm font-bold text-gray-600">
                        <Link href="#" className="hover:text-black transition-colors">Chính sách</Link>
                        <Link href="#" className="hover:text-black transition-colors">Điều khoản và điều kiện</Link>
                    </div>

                    <div className="flex gap-4">
                        <a href="#" className="text-black hover:text-gray-600 transition-colors">
                            <Image
                                src={IMAGES.SOCIAL.TIKTOK}
                                alt="TikTok"
                                width={20}
                                height={20}
                                className="w-5 h-5"
                            />
                        </a>
                        <a href="#" className="text-black hover:text-gray-600 transition-colors">
                            <Image
                                src={IMAGES.SOCIAL.YOUTUBE}
                                alt="YouTube"
                                width={20}
                                height={20}
                                className="w-5 h-5"
                            />
                        </a>
                        <a href="#" className="text-black hover:text-gray-600 transition-colors">
                            <Image
                                src={IMAGES.SOCIAL.FACEBOOK}
                                alt="Facebook"
                                width={20}
                                height={20}
                                className="w-5 h-5"
                            />
                        </a>
                    </div>
                </div>

                <div className="mt-8 text-xs text-gray-400">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
            </div>
        </footer>
    );
}
