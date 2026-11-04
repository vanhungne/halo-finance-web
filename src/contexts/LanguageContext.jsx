import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const LanguageContext = createContext();

export const TRANSLATIONS = {
  vi: {
    nav: {
      features: "Tính năng",
      solutions: "Giải pháp",
      tools: "Công cụ",
      comparison: "So sánh",
      commitment: "Miễn Phí",
      resources: "Tài nguyên",
      openEkyc: "Tải App Miễn Phí",
      appQr: "Mã QR App",
      downloadApp: "Tải ứng dụng",
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
      freeBadge: "Cam kết 100% Miễn Phí",
      goldSjc: "Vàng SJC",
      savingsRate: "Lãi suất gửi",
    },
    hero: {
      badge: "Cam Kết Hoàn Toàn Miễn Phí • Không Phí Ẩn",
      titleBold1: "Quản lý",
      titleMuted1: "tài chính",
      titleMuted2: "nhẹ nhàng hơn,",
      titleMuted3: "cùng",
      titleBold2: "Trợ Lý Tài Chính.",
      title1: "Quản lý tài chính",
      title2: "nhẹ nhàng hơn,",
      title3Prefix: "cùng",
      title3: "Trợ Lý Tài Chính.",
      desc: "Ghi chép thu chi, chia tiền nhóm và theo dõi dòng tiền kinh doanh trong một ứng dụng, với AI hỗ trợ nhập liệu.",
      webPortal: "Dùng bản Web Portal",
      ctaEkyc: "Tải Ứng Dụng Ngay",
      ctaDownload: "Tải App Miễn Phí",
      scanQrHint: "Quét camera để cài đặt ngay",
      activeUsers: "Người dùng tin cậy",
      napasBanks: "Ngân hàng hỗ trợ VietQR",
      uptime: "Thời gian hoạt động",
      guarantee1: "Hỗ trợ 54+ ngân hàng qua VietQR",
      guarantee2: "Chuẩn mã hóa an toàn AES-256",
      guarantee3: "Tuân thủ Nghị định 13/2023/NĐ-CP",
    },
    commitment: {
      title: "Trải Nghiệm Toàn Diện, Hoàn Toàn Miễn Phí",
      subtitle: "Bắt đầu quản lý tài chính cá nhân và nhóm ngay hôm nay mà không có rào cản chi phí ban đầu. Đầy đủ công cụ từ ghi chép, bóc tách hóa đơn AI đến chia tiền VietQR sẵn sàng phục vụ bạn.",
      calcTitle: "Bạn có khoảng bao nhiêu khoản chi tiêu & hóa đơn mỗi tháng?",
      calcDesc: "Kéo thanh trượt bên dưới để ước tính chi phí bạn tiết kiệm được so với việc mua các ứng dụng thu phí khác:",
      savingsTitle: "Tiết Kiệm Ước Tính Mỗi Năm",
      getAccountBtn: "Tải Ứng Dụng Miễn Phí",
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
      freeTag: "Hoàn Toàn Miễn Phí",
    },
  },
  en: {
    nav: {
      features: "Features",
      solutions: "Solutions",
      tools: "Tools",
      comparison: "Compare",
      commitment: "Free",
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
      freeBadge: "100% Free",
      goldSjc: "SJC Gold",
      savingsRate: "Savings Rate",
    },
    hero: {
      badge: "100% Free Guarantee • No Hidden Fees",
      titleBold1: "Manage",
      titleMuted1: "your finances",
      titleMuted2: "with less effort,",
      titleMuted3: "with",
      titleBold2: "Trợ Lý Tài Chính.",
      title1: "Manage your finances",
      title2: "with less effort,",
      title3Prefix: "with",
      title3: "Trợ Lý Tài Chính.",
      desc: "Track expenses, split group costs, and follow your business cash flow in one app, with AI to help you record transactions.",
      webPortal: "Use Web Portal",
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
      title: "Experience Full Features, Completely Free",
      subtitle: "Start managing personal and group finances today with zero upfront cost. Everything from expense tracking, AI receipt scanning to VietQR group funds is ready for you.",
      calcTitle: "How many transactions and receipts do you process each month?",
      calcDesc: "Slide below to estimate your annual savings compared to paid budgeting applications:",
      savingsTitle: "Estimated Annual Savings",
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
      freeTag: "Completely Free",
    },
  },
};

export function LanguageProvider({ children, deferStoredLanguage = false }) {
  const restored = useRef(!deferStoredLanguage);
  const [lang, setLang] = useState(() => {
    if (deferStoredLanguage) return 'vi';
    try {
      const saved = localStorage.getItem("preferred_lang");
      return saved === "en" ? "en" : "vi";
    } catch {
      return "vi";
    }
  });

  useEffect(() => {
    try {
      // Tools hydrate the Vietnamese build HTML before applying a saved shell language.
      if (!restored.current) {
        restored.current = true;
        const saved = localStorage.getItem('preferred_lang');
        if (saved === 'en') setLang('en');
        return;
      }
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
        setLang: setLanguage,
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
