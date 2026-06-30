import { useEffect, useState } from 'react';
import { XCircle, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function ConfirmEmailFail() {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true);
    }, []);

    const handleRedirect = () => {
        // Replace this URL with your actual app URL
        window.location.href = 'vinance://';
    };

    const handleRetry = () => {
        // Replace this with your actual retry logic (e.g., resend confirmation email)
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
            {/* Main content card */}
            <div
                className={`relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full transform transition-all duration-700 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
            >
                {/* Error icon with animation */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <div className={`relative bg-gradient-to-br from-red-400 to-rose-500 rounded-full p-4 transform transition-all duration-500 ${isAnimating ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
                            }`}>
                            <XCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                    Xác thực thất bại
                </h1>

                {/* Description */}
                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                    Chúng tôi không thể xác thực địa chỉ email của bạn. Liên kết có thể đã hết hạn hoặc không hợp lệ.
                </p>

                {/* Error details box */}
                <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-4 mb-6 border border-red-100">
                    <p className="text-sm text-gray-700 text-center font-medium mb-2">
                        Nguyên nhân có thể:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-0.5">•</span>
                            <span>Liên kết xác thực đã hết hạn</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-0.5">•</span>
                            <span>Liên kết xác thực đã được sử dụng</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-0.5">•</span>
                            <span>Địa chỉ email đã được xác thực</span>
                        </li>
                    </ul>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                    {/* Retry button */}
                    <button
                        onClick={handleRetry}
                        className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 group"
                    >
                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        Yêu cầu liên kết mới
                    </button>

                    {/* Go to app button */}
                    <button
                        onClick={handleRedirect}
                        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center gap-2 group"
                    >
                        Đi đến ứng dụng
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>

                {/* Help text */}
                <p className="text-xs text-gray-500 text-center mt-6">
                    Cần giúp đỡ? Liên hệ đội ngũ hỗ trợ
                </p>
            </div>
        </div>
    );
};
