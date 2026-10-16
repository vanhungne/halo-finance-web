import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, CheckCircle, RotateCcw, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

const QUESTIONS = [
  {
    id: 1,
    question: "Bạn thường tiết kiệm được bao nhiêu % thu nhập hàng tháng?",
    options: [
      { text: "Không tiết kiệm được đồng nào, thường hết sạch", score: 5 },
      { text: "Dưới 10% thu nhập", score: 15 },
      { text: "Từ 15% đến 30% thu nhập (Khuyên dùng)", score: 25 },
      { text: "Trên 35% thu nhập mỗi tháng", score: 30 },
    ],
  },
  {
    id: 2,
    question: "Nếu bất ngờ mất nguồn thu, quỹ dự phòng của bạn duy trì sinh hoạt được bao lâu?",
    options: [
      { text: "Chưa có quỹ dự phòng, chỉ sống qua ngày", score: 5 },
      { text: "Duy trì được từ 1 đến 2 tháng", score: 15 },
      { text: "Duy trì từ 3 đến 6 tháng sinh hoạt cơ bản", score: 25 },
      { text: "Duy trì trên 6 tháng đến 1 năm", score: 30 },
    ],
  },
  {
    id: 3,
    question: "Các khoản nợ phải trả hàng tháng (trả góp, vay mượn) chiếm bao nhiêu thu nhập?",
    options: [
      { text: "Chiếm trên 50% thu nhập hàng tháng (Báo động)", score: 5 },
      { text: "Chiếm từ 30% đến 50% thu nhập", score: 15 },
      { text: "Dưới 30% thu nhập (Mức an toàn)", score: 20 },
      { text: "Hoàn toàn không có khoản nợ nào", score: 25 },
    ],
  },
  {
    id: 4,
    question: "Bạn ghi chép và kiểm soát các khoản chi tiêu hàng ngày như thế nào?",
    options: [
      { text: "Không bao giờ ghi chép, nhớ đâu tiêu đó", score: 0 },
      { text: "Thỉnh thoảng ghi chép khi thấy hết tiền", score: 5 },
      { text: "Ghi chép bằng sổ tay hoặc file Excel rời rạc", score: 10 },
      { text: "Ghi chép đều đặn và có ngân sách rõ ràng", score: 15 },
    ],
  },
];

export default function FinancialHealthCheck() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectOption = (questionId, score) => {
    const updated = { ...answers, [questionId]: score };
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  // Calculate total score (max 100)
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

  const getEvaluation = (score) => {
    if (score >= 80) {
      return {
        level: "Rất Vững Vàng",
        tone: "text-emerald-500",
        badgeBg: "bg-emerald-100 text-emerald-800",
        advice:
          "Chúc mừng bạn! Kỷ luật tài chính của bạn rất xuất sắc. Bước tiếp theo là tối ưu danh mục tài sản đầu tư và gia tăng tỷ suất sinh lời cùng Halo Finance.",
      };
    } else if (score >= 50) {
      return {
        level: "Khá Ổn Định",
        tone: "text-sky-500",
        badgeBg: "bg-sky-100 text-sky-800",
        advice:
          "Bạn đã có ý thức tích lũy nhưng cần gia cố quỹ khẩn cấp lên mốc 6 tháng và theo dõi sát các khoản chi lặt vặt để không bị rò rỉ dòng tiền.",
      };
    } else {
      return {
        level: "Cần Cải Thiện Ngay",
        tone: "text-amber-500",
        badgeBg: "bg-amber-100 text-amber-800",
        advice:
          "Dòng tiền của bạn đang có rủi ro cao khi gặp biến cố. Hãy cài đặt ngay Halo Finance để bóc tách thu chi, lập hạn mức ngân sách và cắt giảm chi tiêu không cần thiết.",
      };
    }
  };

  const evaluation = getEvaluation(totalScore);

  return (
    <section id="health-check" className="py-24 sm:py-32 bg-[#f4f7f6]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-widest text-teal-700 mb-4">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            Trắc Nghiệm Tài Chính Nhanh Trong 1 Phút
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Chấm Điểm Sức Khỏe Tài Chính Của Bạn
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Khám phá xem kế hoạch chi tiêu và tích lũy của bạn đang ở mức độ nào để có lộ trình cải thiện rõ ràng.
          </p>
        </div>

        {/* Quiz Box Container */}
        <div className="mt-12 rounded-[2.5rem] border border-slate-200 bg-white p-6 sm:p-10 shadow-xl max-w-2xl mx-auto relative overflow-hidden">
          {!isCompleted ? (
            <div>
              {/* Progress Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Câu hỏi {currentStep + 1} / {QUESTIONS.length}
                </span>
                <span className="text-xs font-black text-sky-600">
                  {Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-teal-500 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <div className="mt-6">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                  {QUESTIONS[currentStep].question}
                </h3>

                {/* Options List */}
                <div className="mt-6 space-y-3">
                  {QUESTIONS[currentStep].options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectOption(QUESTIONS[currentStep].id, opt.score)}
                      className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 hover:shadow-sm transition-all duration-200 flex items-center justify-between group"
                    >
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-950">
                        {opt.text}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-1 transition" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="text-center py-4 space-y-6">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-teal-50 border-4 border-teal-100 text-teal-600 mb-2">
                <Activity className="w-10 h-10" />
              </div>

              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 ${evaluation.badgeBg}`}>
                  Cấp Độ: {evaluation.level}
                </span>
                <h3 className="text-4xl sm:text-5xl font-black text-slate-950">
                  {totalScore} <span className="text-xl font-bold text-slate-400">/ 100 Điểm</span>
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-sm text-slate-700 leading-relaxed">
                <p className="font-bold text-slate-900 mb-1">Lời khuyên dành riêng cho bạn:</p>
                <p>{evaluation.advice}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href="#download"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-950 text-white font-black text-sm hover:bg-sky-600 shadow-md transition"
                >
                  Bắt đầu Cải Thiện Tài Chính Ngay
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-100 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Làm lại bài trắc nghiệm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
