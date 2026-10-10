import { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function ConfirmEmailSuccess() {
    const [countdown, setCountdown] = useState(5);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true);
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            handleRedirect();
        }
    }, [countdown]);

    const handleRedirect = () => {
        window.location.href = 'trolytaichinh://';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
            {/* Main content card */}
            <div
                className={`relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full transform transition-all duration-700 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
            >
                {/* Success icon with animation */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <div className={`relative bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full p-4 transform transition-all duration-500 ${isAnimating ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
                            }`}>
                            <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Xác thực email thành công!
                </h1>

                {/* Description */}
                <p className="text-gray-600 text-center mb-8 leading-relaxed">
                    Email của bạn đã được xác thực thành công. Bạn đã sẵn sàng để tận hưởng tất cả các tính năng của nền tảng của chúng tôi.
                </p>

                {/* Countdown timer */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 mb-6 border border-emerald-100">
                    <p className="text-sm text-gray-600 text-center mb-2">
                        Đang chuyển đến ứng dụng trong
                    </p>
                    <div className="flex justify-center">
                        <div className="bg-white rounded-xl px-6 py-3 shadow-md">
                            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                {countdown}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Redirect button */}
                <button
                    onClick={handleRedirect}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                    Đi đến ứng dụng ngay
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
            </div>
        </div>
    );
};
