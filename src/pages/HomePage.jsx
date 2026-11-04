import { useEffect, useState } from "react";
import Header from "../components/header/headerComp.jsx";
import Footer from "../components/footer/Footer.jsx";
import EpicHero from "../components/home/EpicHero.jsx";
import BeforeAfterSection from "../components/home/BeforeAfterSection.jsx";
import CoreSolutionsShowcase from "../components/home/CoreSolutionsShowcase.jsx";
import RealAppFeatureGrid from "../components/home/RealAppFeatureGrid.jsx";
import CompetitorComparison from "../components/home/CompetitorComparison.jsx";
import ZeroFeeCommitment from "../components/home/ZeroFeeCommitment.jsx";
import SecurityCompliance from "../components/home/SecurityCompliance.jsx";
import WallOfLove from "../components/home/WallOfLove.jsx";
import FinancialHealthCheck from "../components/home/FinancialHealthCheck.jsx";
import FaqSection from "../components/home/FaqSection.jsx";
import ReadyToControlSection from "../components/home/ReadyToControlSection.jsx";
import StickyDownloadBar from "../components/home/StickyDownloadBar.jsx";
import QrDownloadModal from "../components/home/QrDownloadModal.jsx";
import "../styles/landingTheme.css";

export default function HomePage() {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [, setSolution] = useState("personal");

  useEffect(() => {
    // A full navigation from the tools entry can resolve the fragment before
    // React has mounted the homepage. Align it once the target exists.
    if (window.location.hash !== '#features') return;
    const frame = requestAnimationFrame(() => document.getElementById('features')?.scrollIntoView({ behavior: 'instant' }));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleSelectSolution = (seg) => {
    setSolution(seg);
    const targetMap = {
      personal: "solutions-personal",
      group: "solutions-group",
      business: "solutions-business",
    };
    const targetId = targetMap[seg] || "solutions";
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-page overflow-x-clip bg-white text-slate-900">
      <Header
        onOpenQr={() => setQrModalOpen(true)}
        onSelectSolution={handleSelectSolution}
      />

      <main>
        <EpicHero onOpenQr={() => setQrModalOpen(true)} />
        <CoreSolutionsShowcase onOpenQr={() => setQrModalOpen(true)} />
        <BeforeAfterSection />
        <RealAppFeatureGrid onOpenQr={() => setQrModalOpen(true)} />
        <CompetitorComparison />
        <ZeroFeeCommitment onOpenQr={() => setQrModalOpen(true)} />
        <SecurityCompliance />
        <WallOfLove />
        <FinancialHealthCheck />
        <FaqSection />
        <ReadyToControlSection onOpenQr={() => setQrModalOpen(true)} />
      </main>

      <Footer onOpenQr={() => setQrModalOpen(true)} />
      <StickyDownloadBar onOpenQr={() => setQrModalOpen(true)} />
      <QrDownloadModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
    </div>
  );
}
