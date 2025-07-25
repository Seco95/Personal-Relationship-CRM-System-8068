import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ContactList from './components/ContactList';
import ContactDetail from './components/ContactDetail';
import AddContact from './components/AddContact';
import Analytics from './components/Analytics';
import Journal from './components/Journal';
import NetworkGraph from './components/NetworkGraph';
import { ContactProvider } from './context/ContactContext';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ContactProvider>
      <Router>
        <div className="flex h-screen bg-gray-50">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          
          <motion.div 
            className={`flex-1 flex flex-col transition-all duration-300 ${
              sidebarOpen ? 'ml-64' : 'ml-16'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contacts" element={<ContactList />} />
                <Route path="/contacts/:id" element={<ContactDetail />} />
                <Route path="/add-contact" element={<AddContact />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/network" element={<NetworkGraph />} />
              </Routes>
            </main>
          </motion.div>
        </div>
      </Router>
    </ContactProvider>
  );
}

export default App;