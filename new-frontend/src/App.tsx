import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import LoginSignup from './Components/LoginSignup';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Contact from './Components/Contact';
import Information from './Components/Information';
import Landing from './Components/Landing';
import AccountInfo from './Components/AccountInfo';
import DoctorRecommendations from './Components/DoctorRecommendations';
import ReportForm from './Components/ReportForm';
import DownloadReport from './Components/DownloadReport';
import CTScanUpload from './Components/CTScanUpload';
import { GeneralProvider } from './Context/GeneralProvider';
import { UserProvider } from './Components/UserContext';
import useGeneral from './hooks/useGeneral';

import './App.css';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <div className="page-scroll-wrapper">
      <TransitionGroup component={null}>
        <CSSTransition key={location.key} classNames="fade" timeout={300} unmountOnExit>
          <Routes location={location}>
            <Route path="/landing" element={<Landing />} />
            <Route path="/login-signup" element={<LoginSignup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/upload-ctscan" element={<CTScanUpload />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/information" element={<Information />} />
            <Route path="/user" element={<AccountInfo />} />
            <Route path="/doctors" element={<DoctorRecommendations />} />
            <Route path="/report-form" element={<ReportForm />} />
            <Route path="/download-report" element={<DownloadReport />} />
            <Route path="*" element={<Navigate to="/landing" replace />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

// 🔄 AppShell handles auth loading state and layout
const AppShell: React.FC = () => {
  const { loading } = useGeneral();

  if (loading) {
    return (
      <div className="app-loading-screen">
        <div className="loading-content">
          <div className="loading-icon"></div>
          <div className="loading-text">Initializing Brain Tumor Detection AI</div>
          <div className="loading-subtitle">Preparing your medical analysis environment</div>
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <AnimatedRoutes />
    </>
  );
};

const App: React.FC = () => {
  return (
    <GeneralProvider>
      <UserProvider>
        <Router>
          <AppShell />
        </Router>
      </UserProvider>
    </GeneralProvider>
  );
};

export default App;
