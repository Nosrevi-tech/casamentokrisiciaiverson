import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import OurStory from './components/OurStory';
import Venues from './components/Venues';
import GiftList from './components/GiftList';
import RSVP from './components/RSVP';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [currentView, setCurrentView] = useState<'website' | 'admin-login' | 'admin-dashboard'>('website');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAdminAuthenticated(true);
      if (currentView === 'admin-login') {
        setCurrentView('admin-dashboard');
      }
    }
  }, [currentView]);

  const handleAdminClick = () => {
    if (isAdminAuthenticated) {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('admin-login');
    }
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setCurrentView('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentView('website');
  };

  const handleBackToWebsite = () => {
    setCurrentView('website');
  };

  if (currentView === 'admin-login') {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  if (currentView === 'admin-dashboard') {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  return (
    <div className="min-h-screen">
      <Header onAdminClick={handleAdminClick} />
      <Hero />
      <OurStory />
      <Venues />
      <GiftList />
      <RSVP />
      <Footer />
      <MusicPlayer />
    </div>
  );
}

export default App;