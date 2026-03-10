"use client";

import { useState, FormEvent, ChangeEvent } from "react";

interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        // TODO: Implement actual login logic
        console.log("Login attempt:", formData);

        setTimeout(() => {
            setIsLoading(false);
            alert("Đăng nhập thành công!");
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            {/* Login Card */}
            <div className="w-full max-w-md mx-4 p-8 border border-gray-200 rounded-lg shadow-sm">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-black">Đăng nhập</h1>
                    <p className="text-gray-500 mt-2">Chào mừng bạn trở lại!</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-black mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="example@email.com"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-black mb-2"
                        >
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                        />
                        <div className="text-right mt-2">
                            <a
                                href="/forgot-password"
                                className="text-sm text-gray-600 hover:text-black hover:underline transition-colors"
                            >
                                Quên mật khẩu?
                            </a>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-6 bg-black text-white font-medium rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>
            </div>
        </div>
    );
}
