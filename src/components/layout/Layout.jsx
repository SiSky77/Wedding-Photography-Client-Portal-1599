import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-sage-50">
      <Header />
      <main className="pt-20 pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;