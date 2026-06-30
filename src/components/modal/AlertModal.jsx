import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const ICONS = {
    success: <CheckCircle className="w-8 h-8 text-green-600" />,
    error: <XCircle className="w-8 h-8 text-red-600" />,
};

const COLORS = {
    success: "text-green-600",
    error: "text-red-600",
};

const TITLES = {
    success: "Thành công",
    error: "Lỗi",
};

const AlertModal = ({
    isOpen,
    type = "success",
    message,
    onClose,
    autoClose = true,
    duration = 3000
}) => {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [isOpen]);

    if (typeof document === "undefined") return null;
    const modalRoot = document.getElementById("modal-root");
    if (!modalRoot) return null;
    const [countdown, setCountdown] = useState(duration / 1000);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!isOpen || !autoClose) return;

        setCountdown(duration / 1000);
        setProgress(100);

        const interval = setInterval(() => {
            setCountdown(prev => {
                const newCountdown = prev - 1;
                if (newCountdown <= 0) {
                    clearInterval(interval);
                    onClose?.();
                    return 0;
                }
                return newCountdown;
            });
        }, 1000);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const next = prev - 100 / (duration / 100);
                return next <= 0 ? 0 : next;
            });
        }, 100);

        return () => {
            clearInterval(interval);
            clearInterval(progressInterval);
        };
    }, [isOpen, autoClose, duration, onClose]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center text-center">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal box */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative z-10 bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Icon with circle animation */}
                        <div className="relative w-16 h-16 mx-auto mb-4">
                            <svg className="absolute top-0 left-0 w-16 h-16 transform -rotate-90">
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="#e5e7eb"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke={
                                        {
                                            success: "#16a34a",
                                            error: "#dc2626",
                                            warning: "#facc15",
                                            info: "#3b82f6"
                                        }[type]
                                    }
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray={2 * Math.PI * 28}
                                    strokeDashoffset={
                                        ((100 - progress) / 100) * 2 * Math.PI * 28
                                    }
                                    strokeLinecap="round"
                                    style={{ transition: "stroke-dashoffset 0.1s linear" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                {ICONS[type]}
                            </div>
                        </div>

                        <h3 className={`text-xl font-semibold mb-2 ${COLORS[type]}`}>
                            {TITLES[type]}
                        </h3>

                        <p className="text-gray-600 text-sm">{message}</p>

                        {autoClose && (
                            <p className="text-xs text-gray-400 mt-3">
                                Đóng trong <span className="font-semibold">{countdown}</span> giây...
                            </p>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        modalRoot
    );
};

export default AlertModal;
