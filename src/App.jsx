import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Industries from './pages/Industries';
import Careers from './pages/Careers';
import JobsListing from './pages/JobsListing';
import Contact from './pages/Contact';
import Resources from './pages/Resources';
import DynamicServicePage from './pages/DynamicServicePage';

// Admin imports
import AdminLogin from './pages/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import JobsAdmin from './pages/admin/JobsAdmin';
import ApplicationsAdmin from './pages/admin/ApplicationsAdmin';
import InquiriesAdmin from './pages/admin/InquiriesAdmin';
import CaseStudiesAdmin from './pages/admin/CaseStudiesAdmin';
import ServicePagesAdmin from './pages/admin/ServicePagesAdmin';
import TranslateAllAdmin from './pages/admin/TranslateAllAdmin';
import TranslationDiagnostics from './pages/admin/TranslationDiagnostics';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <Toaster position="top-right" />
        <Routes>
        {/* Main Website Routes - Existing UI preserved 100% */}
        <Route path="/" element={
          <div className="min-h-screen bg-white">
            <Header />
            <main><Home /></main>
            <Footer />
          </div>
        } />
        <Route path="/about" element={
          <div className="min-h-screen bg-white">
            <Header />
            <main><About /></main>
            <Footer />
          </div>
        } />
        <Route path="/services" element={
          <div className="min-h-screen bg-white">
            <Header />
            <main><Services /></main>
            <Footer />
          </div>
        } />
        <Route path="/industries" element={
          <div className="min-h-screen bg-white">
            <Header />
            <main><Industries /></main>
            <Footer />
          </div>
        } />
        <Route path="/careers" element={
          <div className="min-h-screen bg-white">
            <Header />
            <main><Careers /></main>
            <Footer />
          </div>
        } />
        <Route path="/jobs" element={
          <div className="min-h-screen bg-white">
            <Header />
            <main><JobsListing /></main>
            <Footer />
          </div>
        } />
        <Route path="/contact" element={
          <div className="min-h-screen bg-white">
            <Header />
            <main><Contact /></main>
            <Footer />
          </div>
        } />
        <Route path="/resources" element={
          <div className="min-h-screen bg-white">
            <Header />
            <main><Resources /></main>
            <Footer />
          </div>
        } />

        {/* Service detail pages (dynamic, uses Supabase translations) */}
        <Route path="/services/:slug" element={
          <div className="min-h-screen bg-white">
            <Header />
            <main><DynamicServicePage /></main>
            <Footer />
          </div>
        } />

        {/* Admin Routes - Completely separate layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="jobs" element={<JobsAdmin />} />
          <Route path="applications" element={<ApplicationsAdmin />} />
          <Route path="inquiries" element={<InquiriesAdmin />} />
          <Route path="case-studies" element={<CaseStudiesAdmin />} />
          <Route path="service-pages" element={<ServicePagesAdmin />} />
          <Route path="translations" element={<TranslateAllAdmin />} />
          <Route path="translation-diagnostics" element={<TranslationDiagnostics />} />
        </Route>
      </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;