import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const TRANSLATIONS = {
  vi: {
    nav: {
      features: "Tính năng",
      solutions: "Giải pháp",
      tools: "Công cụ tính",
      comparison: "So sánh",
      commitment: "Cam kết 0đ",
      resources: "Tài nguyên",
      openEkyc: "Tải App Miễn Phí",
      appQr: "Mã QR App",
      downloadApp: "Tải App Miễn Phí",
      zeroFee: "Free 100%",
      institutionalBadge: "Sổ Thu Chi & Hóa Đơn AI",
      simLink: "Mở màn hình mô phỏng",
      simHint: "Trải nghiệm trực tiếp trên điện thoại của bạn",
      menuTitle: "Tính Năng Cốt Lõi",
      toolsTitle: "Công Cụ Tài Chính Trực Tuyến",
      solutionsTitle: "Giải Pháp Theo Nhu Cầu",
    },
    topBar: {
      personal: "Cá nhân",
      business: "Hộ kinh doanh",
      priority: "Tính năng nổi bật",
      hotline: "Hotline 24/7",
      branches: "Điểm giao dịch",
      freeBadge: "Cam kết 100% Miễn Phí (0đ)",
      goldSjc: "Vàng SJC",
      savingsRate: "Lãi suất gửi",
    },
    hero: {
      badge: "Cam Kết 100% Miễn Phí Trọn Đời • 0đ Phí Ẩn",
      title1: "Làm Chủ Dòng Tiền.",
      title2: "Quản Trị Chi Tiêu Cùng AI.",
      desc: "Ứng dụng quản trị tài chính cá nhân & quỹ nhóm 100% miễn phí trọn đời. Tự động bóc tách hóa đơn trong 3 giây bằng Trí Tuệ Nhân Tạo AI, quản trị ngân sách thông minh và chia tiền nhóm VietQR 1 chạm. Cam kết không quảng cáo, không bán gói.",
      ctaEkyc: "Tải Ứng Dụng Ngay (0đ)",
      ctaDownload: "Tải App 0đ Trọn Đời",
      scanQrHint: "Quét camera để cài đặt ngay",
      activeUsers: "Người dùng tin cậy",
      napasBanks: "Ngân hàng hỗ trợ VietQR",
      uptime: "Thời gian hoạt động",
      guarantee1: "Hỗ trợ 54+ ngân hàng qua VietQR",
      guarantee2: "Chuẩn mã hóa an toàn AES-256",
      guarantee3: "Tuân thủ Nghị định 13/2023/NĐ-CP",
    },
    commitment: {
      badge: "Cam Kết Minh Bạch — 100% Miễn Phí Trọn Đời",
      title: "Không Bán Gói. Không Phí Ẩn.",
      titleHighlight: "Mở Khóa Toàn Bộ Sức Mạnh Quản Trị Chi Tiêu 0đ.",
      subtitle: "Trợ Lý Tài Chính hướng tới sứ mệnh bình dân hóa công nghệ tài chính cho người Việt. Mọi tính năng cao cấp từ Trí Tuệ Nhân Tạo AI, Voice AI đến chia tiền VietQR đều mở sẵn 100% miễn phí, không giới hạn.",
      calcTitle: "Bạn thực hiện khoảng bao nhiêu giao dịch & quét hóa đơn/tháng?",
      calcDesc: "Kéo thanh trượt bên dưới để ước tính số tiền bạn tiết kiệm được so với việc phải mua các gói app quản lý chi tiêu khác:",
      savingsTitle: "Số Tiền Bạn Tiết Kiệm Được Mỗi Năm",
      getAccountBtn: "Tải App 0đ Ngay",
    },
    simulator: {
      badge: "Mô Phỏng Trực Tiếp",
      title: "Trải Nghiệm Ứng Dụng Thực Tế",
      subtitle: "Chạm và tương tác trực tiếp với các tính năng thực tế trên điện thoại",
      tabOverview: "Tổng quan",
      tabScan: "Quét hóa đơn AI",
      tabGroup: "Quỹ nhóm",
      tabAssets: "Tài sản & Vàng",
    },
    footer: {
      tagline: "Ứng Dụng Quản Lý Tài Chính & Sổ Thu Chi Thông Minh AI",
      cskh: "Tổng đài CSKH 24/7",
      email: "Email tiếp nhận",
      securityBadge: "Bảo chứng an toàn",
      companyName: "Trợ Lý Tài Chính (TroLyTaiChinh)",
      companyDesc: "Nền tảng quản lý tài chính thông minh cho cá nhân, gia đình và hội nhóm tại Việt Nam. Bóc tách hóa đơn AI trong 3 giây, chia tiền VietQR 1 chạm, quản lý ngân sách 50/30/20 và mã hóa an toàn dữ liệu chuẩn AES-256.",
      headquarters: "Trụ sở chính: Tầng 48, Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Q. Bình Thạnh, TP. Hồ Chí Minh",
      hanoiBranch: "Chi nhánh Hà Nội: Tầng 32, Keangnam Hanoi Landmark 72, Đường Phạm Hùng, Q. Nam Từ Liêm, Hà Nội",
      productsTitle: "Tính Năng & Sản Phẩm",
      toolsTitle: "Công Cụ Trực Tuyến",
      legalTitle: "Pháp Lý & Hỗ Trợ",
      rights: "Bản quyền © 2026 Trợ Lý Tài Chính. Tất cả các quyền được bảo lưu.",
      freeTag: "100% Miễn Phí Trọn Đời",
    },
  },
  en: {
    nav: {
      features: "Features",
      solutions: "Solutions",
      tools: "Calculators",
      comparison: "Compare",
      commitment: "Zero Fee Policy",
      resources: "Resources",
      openEkyc: "Download App Free",
      appQr: "App QR Code",
      downloadApp: "Download App",
      zeroFee: "100% Free",
      institutionalBadge: "Smart Finance & AI Receipt",
      simLink: "Open live simulator",
      simHint: "Interactive preview right on your smartphone",
      menuTitle: "Core Features",
      toolsTitle: "Financial Tools Online",
      solutionsTitle: "Tailored Solutions",
    },
    topBar: {
      personal: "Personal",
      business: "Small Business",
      priority: "Key Features",
      hotline: "24/7 Hotline",
      branches: "Support Centers",
      freeBadge: "100% Lifetime Free (0₫)",
      goldSjc: "SJC Gold",
      savingsRate: "Savings Rate",
    },
    hero: {
      badge: "100% Lifetime Free Guarantee • 0₫ Hidden Fees",
      title1: "Master Your Cash Flow.",
      title2: "AI-Powered Expense Management.",
      desc: "Smart personal and group finance app, 100% free for life. Automatically extract receipts in 3 seconds with AI Vision, manage budgets effortlessly, and split bills with 1-tap VietQR. Zero ads, zero paywalls.",
      ctaEkyc: "Get Free App Now",
      ctaDownload: "Download App Free",
      scanQrHint: "Scan with camera to install immediately",
      activeUsers: "Trusted Users",
      napasBanks: "Supported VietQR Banks",
      uptime: "System Availability",
      guarantee1: "Supports 54+ VietQR Banks",
      guarantee2: "AES-256 Military-Grade Encryption",
      guarantee3: "Compliant with Privacy Decree 13/2023",
    },
    commitment: {
      badge: "Transparent Policy — 100% Free For Life",
      title: "No Subscriptions. No Hidden Fees.",
      titleHighlight: "Unlock Full Financial Power at 0₫.",
      subtitle: "Empowering everyday users to master their finances. All premium features including AI OCR Receipt Extraction, Voice AI, and VietQR Bill Splitting are unlocked free forever.",
      calcTitle: "How many transactions and receipts do you process each month?",
      calcDesc: "Slide below to calculate your estimated annual savings compared to paid budgeting apps:",
      savingsTitle: "Your Estimated Annual Savings",
      getAccountBtn: "Get Free App Now",
    },
    simulator: {
      badge: "Live Simulator",
      title: "Interactive App Experience",
      subtitle: "Tap and interact directly with real features on the smartphone simulator",
      tabOverview: "Overview",
      tabScan: "AI Receipt Scan",
      tabGroup: "Group Fund",
      tabAssets: "Net Worth & Assets",
    },
    footer: {
      tagline: "Smart Personal Finance & AI Receipt Management",
      cskh: "24/7 Customer Care",
      email: "Support Email",
      securityBadge: "Certified Security",
      companyName: "TroLyTaiChinh Technology JSC",
      companyDesc: "Smart financial management platform for individuals, families, and teams. Instant AI receipt scanner, 1-tap VietQR split bill, 50/30/20 budget planner, and end-to-end AES-256 data protection.",
      headquarters: "Headquarters: 48th Fl, Landmark 81, 720A Dien Bien Phu, Ward 22, Binh Thanh Dist, HCMC",
      hanoiBranch: "Hanoi Branch: 32nd Fl, Keangnam Hanoi Landmark 72, Pham Hung, Nam Tu Liem Dist, Hanoi",
      productsTitle: "Features & Products",
      toolsTitle: "Online Tools",
      legalTitle: "Legal & Support",
      rights: "Copyright © 2026 TroLyTaiChinh. All rights reserved.",
      freeTag: "100% Lifetime Free",
    },
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("preferred_lang");
      return saved === "en" ? "en" : "vi";
    } catch {
      return "vi";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("preferred_lang", lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "vi" ? "en" : "vi"));
  };

  const setLanguage = (newLang) => {
    if (newLang === "vi" || newLang === "en") {
      setLang(newLang);
    }
  };

  const strings = TRANSLATIONS[lang] || TRANSLATIONS.vi;

  return (
    <LanguageContext.Provider
      value={{
        lang,
        strings,
        toggleLanguage,
        setLanguage,
        isVietnamese: lang === "vi",
        isEnglish: lang === "en",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
