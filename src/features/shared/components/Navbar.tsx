'use client';

import Link from 'next/link';
import { Search, ShoppingCart, Bell, ChevronDown, Menu } from 'lucide-react';

export function Navbar() {
    return (
        <header className="w-full bg-white dark:bg-black border-b border-gray-200 sticky top-0 z-50">
            <div className="bg-white border-b border-gray-100 text-[13px] py-2 text-gray-600">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex space-x-6">
                        <Link href="#" className="hover:text-red-500">Tải ứng dụng</Link>
                        <Link href="#" className="hover:text-red-500">Kênh buôn bán</Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="#" className="hover:text-red-500">Hỗ trợ</Link>
                        <div className="h-3 w-[1px] bg-gray-300"></div>
                        <Link href="/login" className="hover:text-red-500">Đăng nhập</Link>
                        <div className="h-3 w-[1px] bg-gray-300"></div>
                        <Link href="/register" className="hover:text-red-500">Đăng ký</Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-5 flex items-center justify-between gap-8">
                <Link href="/" className="text-3xl font-bold text-gray-800 flex-shrink-0">
                    Nav bar
                </Link>

                <button className="lg:hidden p-2">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="hidden lg:flex flex-1 max-w-4xl">
                    <div className="flex w-full h-11 bg-white rounded-md border border-gray-300 overflow-hidden hover:border-gray-400 transition-colors">
                        <div className="flex items-center px-4 border-r border-gray-300 bg-white cursor-pointer hover:bg-gray-50 transition-colors min-w-[140px] justify-between">
                            <span className="text-sm text-gray-700">Chọn danh mục</span>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1 flex items-center px-4">
                            <Search className="w-5 h-5 text-gray-400 mr-3" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm"
                                className="flex-1 h-full text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none bg-transparent"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <Link href="/cart" className="text-gray-600 hover:text-red-500 transition-colors">
                        <ShoppingCart className="w-6 h-6" />
                    </Link>

                    <Link href="/notifications" className="text-gray-600 hover:text-red-500 transition-colors">
                        <Bell className="w-6 h-6" />
                    </Link>
                </div>
            </div>

            <div className="lg:hidden px-4 pb-3">
                <div className="flex w-full bg-white rounded-md border border-gray-300 overflow-hidden">
                    <button className="px-3 text-gray-400">
                        <Search className="w-4 h-4" />
                    </button>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm"
                        className="flex-1 py-2 text-sm focus:outline-none"
                    />
                </div>
            </div>
        </header>
    );
}
