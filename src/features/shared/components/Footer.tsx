import Link from "next/link";
import { Facebook, Youtube, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-white font-bold mb-4">Về chúng tôi</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    Tuyển dụng
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4">Hỗ trợ</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    Liên hệ
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    Chính sách
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4">Sản phẩm</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    Danh mục
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    Flash sale
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    Hot deals
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4">Theo dõi</h3>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <Youtube className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 mt-8 text-center text-sm text-gray-400">
                    <p>&copy; 2024 Social Commerce. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
