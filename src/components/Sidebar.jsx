import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiHome, 
  FiUsers, 
  FiUserPlus, 
  FiBarChart3, 
  FiBookOpen, 
  FiMenu,
  FiX,
  FiShare2
} = FiIcons;

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/contacts', icon: FiUsers, label: 'Kontakte' },
    { path: '/add-contact', icon: FiUserPlus, label: 'Neuer Kontakt' },
    { path: '/network', icon: FiShare2, label: 'Netzwerk' },
    { path: '/analytics', icon: FiBarChart3, label: 'Analysen' },
    { path: '/journal', icon: FiBookOpen, label: 'Journal' },
  ];

  return (
    <>
      <motion.div
        className={`fixed left-0 top-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-16'
        }`}
        initial={false}
        animate={{ width: isOpen ? 256 : 64 }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {isOpen && (
            <motion.h1 
              className="text-xl font-bold text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Personal CRM
            </motion.h1>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={isOpen ? FiX : FiMenu} className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={item.icon} className="w-5 h-5" />
              {isOpen && (
                <motion.span 
                  className="ml-3 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          ))}
        </nav>
      </motion.div>

      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;