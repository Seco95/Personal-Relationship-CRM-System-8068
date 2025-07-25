import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContacts } from '../context/ContactContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiUsers, 
  FiTrendingUp, 
  FiHeart, 
  FiAlertTriangle,
  FiPlus,
  FiCalendar,
  FiShare2
} = FiIcons;

const Dashboard = () => {
  const { contacts, journalEntries, relationships } = useContacts();

  const stats = {
    totalContacts: contacts.length,
    activeRelationships: contacts.filter(c => c.relationshipStatus === 'aktiv').length,
    toxicRelationships: contacts.filter(c => c.relationshipStatus === 'toxisch').length,
    recentEntries: journalEntries.slice(0, 3),
    totalConnections: relationships.length
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Übersicht über deine Beziehungen und Kontakte</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={itemVariants}
      >
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gesamt Kontakte</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verbindungen</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalConnections}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <SafeIcon icon={FiShare2} className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktive Beziehungen</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeRelationships}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <SafeIcon icon={FiHeart} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toxische Kontakte</p>
              <p className="text-2xl font-bold text-red-600">{stats.toxicRelationships}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Schnellaktionen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/add-contact"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <SafeIcon icon={FiPlus} className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Neuer Kontakt</h3>
                <p className="text-sm text-gray-600">Person hinzufügen</p>
              </div>
            </div>
          </Link>

          <Link
            to="/network"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <SafeIcon icon={FiShare2} className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Netzwerkgraph</h3>
                <p className="text-sm text-gray-600">Beziehungen visualisieren</p>
              </div>
            </div>
          </Link>

          <Link
            to="/journal"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                <SafeIcon icon={FiCalendar} className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Journal Eintrag</h3>
                <p className="text-sm text-gray-600">Interaktion notieren</p>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Recent Journal Entries */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Letzte Journal Einträge</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {stats.recentEntries.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {stats.recentEntries.map((entry) => (
                <div key={entry.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{entry.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{entry.content.substring(0, 100)}...</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.date).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">Noch keine Journal Einträge vorhanden</p>
              <Link
                to="/journal"
                className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-700"
              >
                Ersten Eintrag erstellen
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;