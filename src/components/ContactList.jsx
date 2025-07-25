import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContacts } from '../context/ContactContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiFilter, FiPlus, FiEye } = FiIcons;

const ContactList = () => {
  const { contacts } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('alle');
  const [filterStatus, setFilterStatus] = useState('alle');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.nickname?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'alle' || contact.category === filterCategory;
    const matchesStatus = filterStatus === 'alle' || contact.relationshipStatus === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'aktiv': return 'bg-green-100 text-green-800';
      case 'passiv': return 'bg-yellow-100 text-yellow-800';
      case 'unterbrochen': return 'bg-orange-100 text-orange-800';
      case 'toxisch': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'freund': return 'bg-blue-100 text-blue-800';
      case 'familie': return 'bg-purple-100 text-purple-800';
      case 'kunde': return 'bg-green-100 text-green-800';
      case 'mentor': return 'bg-indigo-100 text-indigo-800';
      case 'feind': return 'bg-red-100 text-red-800';
      case 'rivale': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kontakte</h1>
          <p className="text-gray-600">{filteredContacts.length} von {contacts.length} Kontakten</p>
        </div>
        <Link
          to="/add-contact"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Neuer Kontakt
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Kontakte durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="alle">Alle Kategorien</option>
            <option value="freund">Freund</option>
            <option value="familie">Familie</option>
            <option value="kunde">Kunde</option>
            <option value="mentor">Mentor</option>
            <option value="feind">Feind</option>
            <option value="rivale">Rivale</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="alle">Alle Status</option>
            <option value="aktiv">Aktiv</option>
            <option value="passiv">Passiv</option>
            <option value="unterbrochen">Unterbrochen</option>
            <option value="toxisch">Toxisch</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
      </div>

      {/* Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <motion.div
            key={contact.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                  {contact.nickname && (
                    <p className="text-sm text-gray-500">"{contact.nickname}"</p>
                  )}
                </div>
              </div>
              <Link
                to={`/contacts/${contact.id}`}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <SafeIcon icon={FiEye} className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(contact.category)}`}>
                  {contact.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.relationshipStatus)}`}>
                  {contact.relationshipStatus}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Vertrauen:</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full mr-1 ${
                        i < contact.trustLevel ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Wichtigkeit:</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full mr-1 ${
                        i < contact.importance ? 'bg-purple-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Letzter Kontakt: {new Date(contact.lastContact).toLocaleDateString('de-DE')}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Keine Kontakte gefunden</p>
          <p className="text-gray-400 mt-2">Versuche andere Suchbegriffe oder Filter</p>
        </div>
      )}
    </motion.div>
  );
};

export default ContactList;