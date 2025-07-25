import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useContacts } from '../context/ContactContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiEdit, FiCalendar, FiUser, FiHeart, FiZap } = FiIcons;

const Journal = () => {
  const { journalEntries, addJournalEntry, contacts } = useContacts();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    contactId: '',
    emotion: 'neutral',
    tags: '',
    learned: '',
    nextAction: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    addJournalEntry(entry);
    setFormData({
      title: '',
      content: '',
      contactId: '',
      emotion: 'neutral',
      tags: '',
      learned: '',
      nextAction: ''
    });
    setShowForm(false);
  };

  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case 'positiv': return 'bg-green-100 text-green-800';
      case 'negativ': return 'bg-red-100 text-red-800';
      case 'inspiriert': return 'bg-purple-100 text-purple-800';
      case 'frustriert': return 'bg-orange-100 text-orange-800';
      case 'stolz': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'Unbekannt';
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
          <h1 className="text-3xl font-bold text-gray-900">Kontakt Journal</h1>
          <p className="text-gray-600">Dokumentiere deine Interaktionen und Erkenntnisse</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Neuer Eintrag
        </button>
      </div>

      {/* Journal Entries */}
      <div className="space-y-6">
        {journalEntries.map((entry) => (
          <motion.div
            key={entry.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{entry.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                    {new Date(entry.date).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {entry.contactId && (
                    <div className="flex items-center">
                      <SafeIcon icon={FiUser} className="w-4 h-4 mr-1" />
                      {getContactName(entry.contactId)}
                    </div>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmotionColor(entry.emotion)}`}>
                    {entry.emotion}
                  </span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none mb-4">
              <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
            </div>

            {entry.learned && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <SafeIcon icon={FiZap} className="w-4 h-4 text-blue-600 mr-2" />
                  <h4 className="font-medium text-blue-900">Was ich gelernt habe</h4>
                </div>
                <p className="text-blue-800">{entry.learned}</p>
              </div>
            )}

            {entry.nextAction && (
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <SafeIcon icon={FiEdit} className="w-4 h-4 text-green-600 mr-2" />
                  <h4 className="font-medium text-green-900">Nächste Schritte</h4>
                </div>
                <p className="text-green-800">{entry.nextAction}</p>
              </div>
            )}

            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}

        {journalEntries.length === 0 && (
          <div className="text-center py-12">
            <SafeIcon icon={FiEdit} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Noch keine Einträge</h3>
            <p className="text-gray-500 mb-4">Beginne damit, deine ersten Interaktionen zu dokumentieren</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ersten Eintrag erstellen
            </button>
          </div>
        )}
      </div>

      {/* Journal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Neuer Journal Eintrag</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titel *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Kurze Beschreibung der Interaktion"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bezugsperson</label>
                <select
                  value={formData.contactId}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Keine Person zuordnen</option>
                  {contacts.map(contact => (
                    <option key={contact.id} value={contact.id}>{contact.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emotion</label>
                <select
                  value={formData.emotion}
                  onChange={(e) => setFormData(prev => ({ ...prev, emotion: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="positiv">Positiv</option>
                  <option value="neutral">Neutral</option>
                  <option value="negativ">Negativ</option>
                  <option value="inspiriert">Inspiriert</option>
                  <option value="frustriert">Frustriert</option>
                  <option value="stolz">Stolz</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inhalt *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Was ist passiert? Wie war die Interaktion?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Was habe ich gelernt?</label>
                <textarea
                  value={formData.learned}
                  onChange={(e) => setFormData(prev => ({ ...prev, learned: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Erkenntnisse, Reflexionen, neue Einsichten..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nächste Schritte</label>
                <textarea
                  value={formData.nextAction}
                  onChange={(e) => setFormData(prev => ({ ...prev, nextAction: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Was möchte ich als nächstes tun?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Schlagwörter, getrennt durch Kommas"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Speichern
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Journal;