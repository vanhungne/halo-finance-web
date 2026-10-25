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
      openEkyc: "Mở Tài Khoản eKYC",
      appQr: "Mã QR App",
      downloadApp: "Tải App Miễn Phí",
      zeroFee: "Free 100%",
      institutionalBadge: "Định Chế Tài Chính Số",
      simLink: "Mở màn hình mô phỏng",
      simHint: "Trải nghiệm trực tiếp trên điện thoại của bạn",
      menuTitle: "Dịch Vụ Ngân Hàng Số",
      toolsTitle: "Công Cụ Tài Chính Trực Tuyến",
      solutionsTitle: "Giải Pháp Theo Nhu Cầu",
    },
    topBar: {
      personal: "Cá nhân",
      business: "Doanh nghiệp & Hộ KD",
      priority: "Khách hàng Ưu tiên (Priority)",
      hotline: "Hotline 24/7",
      branches: "Điểm giao dịch",
      freeBadge: "Cam kết 100% Miễn Phí (0đ)",
      goldSjc: "Vàng SJC",
      savingsRate: "Lãi suất gửi",
    },
    hero: {
      badge: "Cam Kết 100% Miễn Phí Trọn Đời • 0đ Phí Ẩn",
      title1: "Làm Chủ Dòng Tiền.",
      title2: "Quản Trị Tài Chính Cùng AI.",
      desc: "Hệ sinh thái quản trị tài chính cá nhân & quỹ nhóm 100% miễn phí trọn đời kết nối trực tiếp 54+ ngân hàng NAPAS 24/7. Tự động bóc tách hóa đơn trong 3 giây bằng Trí Tuệ Nhân Tạo AI, chia tiền nhóm VietQR 1 chạm, và bảo vệ tài sản chuẩn PCI-DSS & ISO 27001.",
      ctaEkyc: "Mở Tài Khoản eKYC (0đ Phí)",
      ctaDownload: "Tải App 0đ Trọn Đời",
      scanQrHint: "Quét camera để cài đặt ngay",
      activeUsers: "Người dùng kích hoạt",
      napasBanks: "Ngân hàng liên kết",
      uptime: "Sẵn sàng hoạt động",
      guarantee1: "Liên kết 54+ ngân hàng NAPAS 24/7",
      guarantee2: "Chuẩn an ninh số PCI-DSS & ISO 27001",
      guarantee3: "Tuân thủ Nghị định 13/2023/NĐ-CP",
    },
    commitment: {
      badge: "Cam Kết Minh Bạch — 100% Miễn Phí Trọn Đời",
      title: "Không Bán Gói. Không Phí Ẩn.",
      titleHighlight: "Mở Khóa Toàn Bộ Sức Mạnh Tài Chính 0đ.",
      subtitle: "Trợ Lý Tài Chính hướng tới sứ mệnh bình dân hóa công nghệ tài chính cho người Việt. Mọi tính năng cao cấp từ Trí Tuệ Nhân Tạo AI, Voice AI đến chia tiền VietQR đều mở sẵn 100% miễn phí, không giới hạn.",
      calcTitle: "Bạn thực hiện khoảng bao nhiêu giao dịch & quét hóa đơn/tháng?",
      calcDesc: "Kéo thanh trượt bên dưới để ước tính số tiền bạn tiết kiệm được so với việc phải mua các gói app quản lý chi tiêu khác:",
      savingsTitle: "Số Tiền Bạn Tiết Kiệm Được Mỗi Năm",
      getAccountBtn: "Nhận Tài Khoản 0đ Ngay",
    },
    simulator: {
      badge: "Mô Phỏng Trực Tiếp",
      title: "Trải Nghiệm Siêu Ứng Dụng",
      subtitle: "Chạm và tương tác trực tiếp trên mô hình iPhone 16 Pro đẳng cấp",
      tabOverview: "Tổng quan",
      tabScan: "Quét hóa đơn AI",
      tabGroup: "Quỹ nhóm",
      tabAssets: "Tài sản & Vàng",
    },
    footer: {
      tagline: "Định Chế Quản Trị Dòng Tiền & Ngân Hàng Số Thế Hệ Mới",
      cskh: "Tổng đài CSKH 24/7",
      email: "Email tiếp nhận",
      securityBadge: "Bảo chứng an toàn",
      companyName: "Công Ty Cổ Phần Công Nghệ Trợ Lý Tài Chính",
      companyDesc: "Nền tảng tài chính số đa phương thức phục vụ hơn 3.2 triệu cá nhân, gia đình và hộ kinh doanh tại Việt Nam. Kết nối 54+ ngân hàng chuẩn NAPAS 24/7, bóc tách hóa đơn Trí Tuệ Nhân Tạo AI trong 3 giây và quản trị dòng tiền chuẩn mực quốc tế.",
      headquarters: "Trụ sở chính: Tầng 48, Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Q. Bình Thạnh, TP. Hồ Chí Minh",
      hanoiBranch: "Chi nhánh Hà Nội: Tầng 32, Keangnam Hanoi Landmark 72, Đường Phạm Hùng, Q. Nam Từ Liêm, Hà Nội",
      productsTitle: "Sản Phẩm & Dịch Vụ",
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
      openEkyc: "Open eKYC Account",
      appQr: "App QR Code",
      downloadApp: "Download App",
      zeroFee: "100% Free",
      institutionalBadge: "Digital Financial Institution",
      simLink: "Open live simulator",
      simHint: "Interactive preview right on your smartphone",
      menuTitle: "Digital Banking Services",
      toolsTitle: "Online Financial Calculators",
      solutionsTitle: "Tailored Solutions",
    },
    topBar: {
      personal: "Personal",
      business: "Business & SME",
      priority: "Priority Banking",
      hotline: "24/7 Hotline",
      branches: "ATM & Branches",
      freeBadge: "100% Free Forever Guarantee",
      goldSjc: "SJC Gold",
      savingsRate: "Deposit Rate",
    },
    hero: {
      badge: "100% Free Forever Guarantee • Zero Hidden Fees",
      title1: "Master Your Cashflow.",
      title2: "Smart Financial AI.",
      desc: "100% free-forever personal and group financial management ecosystem connecting directly with 54+ banks 24/7. Instant 3-second AI receipt extraction, 1-touch VietQR bill splitting, bank-grade PCI-DSS & ISO 27001 security.",
      ctaEkyc: "Open eKYC Account (0đ Fee)",
      ctaDownload: "Download App Free Forever",
      scanQrHint: "Scan with camera to install instantly",
      activeUsers: "Active Users",
      napasBanks: "Connected Banks",
      uptime: "System Uptime",
      guarantee1: "Connected with 54+ NAPAS banks 24/7",
      guarantee2: "PCI-DSS Level 1 & ISO 27001 Certified",
      guarantee3: "Compliant with Decree 13/2023/ND-CP",
    },
    commitment: {
      badge: "Transparent Guarantee — 100% Free Forever",
      title: "No Subscriptions. No Hidden Fees.",
      titleHighlight: "Unlock Full Financial Superpowers at 0đ.",
      subtitle: "Trợ Lý Tài Chính democratizes high-tech financial management for everyone. Every advanced superpower from AI Vision OCR and Voice AI to VietQR group funds is 100% free with unlimited access.",
      calcTitle: "How many transactions & receipts do you scan monthly?",
      calcDesc: "Drag the slider below to estimate how much you save every year compared to subscription-based budgeting apps:",
      savingsTitle: "Estimated Annual Savings",
      getAccountBtn: "Get Free 0đ Account Now",
    },
    simulator: {
      badge: "Live Interactive Simulation",
      title: "Experience The Super App",
      subtitle: "Touch and interact directly on an iPhone 16 Pro flagship device",
      tabOverview: "Overview",
      tabScan: "AI Receipt OCR",
      tabGroup: "Group Funds",
      tabAssets: "Assets & Gold",
    },
    footer: {
      tagline: "Next-Gen Cashflow Management & Digital Banking Institution",
      cskh: "24/7 Customer Support",
      email: "Official Email",
      securityBadge: "Certified Security",
      companyName: "Tro Ly Tai Chinh Financial Technology Joint Stock Company",
      companyDesc: "Multi-channel digital financial platform serving over 3.2M individuals, families, and businesses across Vietnam. Connected to 54+ NAPAS banks 24/7, with 3-second AI receipt parsing and international security standards.",
      headquarters: "Headquarters: 48th Floor, Landmark 81, 720A Dien Bien Phu, Ward 22, Binh Thanh Dist., Ho Chi Minh City",
      hanoiBranch: "Hanoi Branch: 32nd Floor, Keangnam Hanoi Landmark 72, Pham Hung Road, Nam Tu Liem Dist., Hanoi",
      productsTitle: "Products & Services",
      toolsTitle: "Online Calculators",
      legalTitle: "Legal & Support",
      rights: "Copyright © 2026 Trợ Lý Tài Chính. All rights reserved.",
      freeTag: "100% Free Forever",
    },
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem("app_language") || "vi";
  });

  const setLang = (newLang) => {
    if (newLang === "vi" || newLang === "en") {
      setLangState(newLang);
      localStorage.setItem("app_language", newLang);
      document.documentElement.lang = newLang;
    }
  };

  const toggleLang = () => {
    setLang(lang === "vi" ? "en" : "vi");
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (section, key) => {
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][section] && TRANSLATIONS[lang][section][key]) {
      return TRANSLATIONS[lang][section][key];
    }
    return TRANSLATIONS.vi?.[section]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, strings: TRANSLATIONS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
