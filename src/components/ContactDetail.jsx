import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useContacts } from '../context/ContactContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiArrowLeft, 
  FiEdit, 
  FiTrash2, 
  FiPlus, 
  FiMessageCircle,
  FiCalendar,
  FiHeart,
  FiTrendingUp,
  FiAlertTriangle,
  FiUsers,
  FiLink
} = FiIcons;

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    contacts, 
    updateContact, 
    deleteContact, 
    addInteraction, 
    getRelationshipsForContact,
    addRelationship
  } = useContacts();
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [showRelationshipForm, setShowRelationshipForm] = useState(false);
  const [interactionData, setInteractionData] = useState({
    type: 'gespräch',
    content: '',
    emotion: 'neutral',
    learned: ''
  });
  const [relationshipData, setRelationshipData] = useState({
    targetId: '',
    type: 'neutral',
    notes: ''
  });

  const contact = contacts.find(c => c.id === id);
  const relationships = getRelationshipsForContact(id);

  if (!contact) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Kontakt nicht gefunden</p>
        <button
          onClick={() => navigate('/contacts')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Zurück zur Kontaktliste
        </button>
      </div>
    );
  }

  const handleDeleteContact = () => {
    if (window.confirm('Möchtest du diesen Kontakt wirklich löschen?')) {
      deleteContact(id);
      navigate('/contacts');
    }
  };

  const handleAddInteraction = (e) => {
    e.preventDefault();
    addInteraction(id, interactionData);
    setInteractionData({
      type: 'gespräch',
      content: '',
      emotion: 'neutral',
      learned: ''
    });
    setShowInteractionForm(false);
  };

  const handleAddRelationship = (e) => {
    e.preventDefault();
    addRelationship(
      id,
      relationshipData.targetId,
      relationshipData.type,
      relationshipData.notes
    );
    setRelationshipData({
      targetId: '',
      type: 'neutral',
      notes: ''
    });
    setShowRelationshipForm(false);
  };

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

  const getRelationshipColor = (type) => {
    switch (type) {
      case 'positiv': return 'bg-green-100 text-green-800 border-green-300';
      case 'negativ': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getConnectedContactName = (relationshipId) => {
    const relationship = relationships.find(r => r.id === relationshipId);
    if (!relationship) return 'Unbekannt';
    
    const connectedId = relationship.sourceId === id ? relationship.targetId : relationship.sourceId;
    const connectedContact = contacts.find(c => c.id === connectedId);
    return connectedContact ? connectedContact.name : 'Unbekannt';
  };

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/contacts')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{contact.name}</h1>
              {contact.nickname && (
                <p className="text-gray-600">"{contact.nickname}"</p>
              )}
              <div className="flex items-center mt-2 space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(contact.category)}`}>
                  {contact.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.relationshipStatus)}`}>
                  {contact.relationshipStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowInteractionForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Interaktion
          </button>
          <button
            onClick={() => setShowRelationshipForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <SafeIcon icon={FiLink} className="w-4 h-4 mr-2" />
            Beziehung
          </button>
          <button
            onClick={handleDeleteContact}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bewertung */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bewertung & Analyse</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <SafeIcon icon={FiHeart} className="w-5 h-5 text-red-500 mr-1" />
                  <span className="font-semibold">Vertrauen</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{contact.trustLevel}/5</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-purple-500 mr-1" />
                  <span className="font-semibold">Wichtigkeit</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">{contact.importance}/5</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-green-500 mr-1" />
                  <span className="font-semibold">Potenzial</span>
                </div>
                <div className="text-lg font-bold text-green-600 capitalize">{contact.potential}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-orange-500 mr-1" />
                  <span className="font-semibold">Energie</span>
                </div>
                <div className="text-sm font-bold text-orange-600 capitalize">{contact.energyBalance}</div>
              </div>
            </div>
          </div>

          {/* Beziehungen */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Beziehungen</h2>
              <button
                onClick={() => setShowRelationshipForm(true)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
                Hinzufügen
              </button>
            </div>
            
            {relationships && relationships.length > 0 ? (
              <div className="space-y-3">
                {relationships.map((relationship) => {
                  const connectedId = relationship.sourceId === id ? relationship.targetId : relationship.sourceId;
                  const connectedContact = contacts.find(c => c.id === connectedId);
                  if (!connectedContact) return null;
                  
                  return (
                    <div 
                      key={relationship.id} 
                      className={`p-3 border rounded-lg flex items-center justify-between ${getRelationshipColor(relationship.type)}`}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {connectedContact.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <Link 
                            to={`/contacts/${connectedContact.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600"
                          >
                            {connectedContact.name}
                          </Link>
                          <p className="text-xs text-gray-500">
                            {relationship.notes || "Keine Notizen"}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm capitalize">
                        {relationship.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Keine Beziehungen definiert
              </p>
            )}
          </div>

          {/* Persönliche Notizen */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Persönliche Notizen</h2>
            <div className="space-y-4">
              {contact.personalNotes && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Allgemeine Notizen</h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{contact.personalNotes}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contact.strengths && (
                  <div>
                    <h3 className="font-medium text-green-700 mb-2">Stärken</h3>
                    <p className="text-gray-600 bg-green-50 p-3 rounded-lg">{contact.strengths}</p>
                  </div>
                )}
                {contact.weaknesses && (
                  <div>
                    <h3 className="font-medium text-red-700 mb-2">Schwächen</h3>
                    <p className="text-gray-600 bg-red-50 p-3 rounded-lg">{contact.weaknesses}</p>
                  </div>
                )}
                {contact.interests && (
                  <div>
                    <h3 className="font-medium text-blue-700 mb-2">Interessen</h3>
                    <p className="text-gray-600 bg-blue-50 p-3 rounded-lg">{contact.interests}</p>
                  </div>
                )}
                {contact.triggerPoints && (
                  <div>
                    <h3 className="font-medium text-orange-700 mb-2">Triggerpunkte</h3>
                    <p className="text-gray-600 bg-orange-50 p-3 rounded-lg">{contact.triggerPoints}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Psychogramm */}
          {(contact.behaviorPatterns || contact.beliefs || contact.redFlags || contact.motivations || contact.fears) && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Psychogramm</h2>
              <div className="space-y-4">
                {contact.behaviorPatterns && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Verhaltensmuster</h3>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{contact.behaviorPatterns}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contact.beliefs && (
                    <div>
                      <h3 className="font-medium text-purple-700 mb-2">Glaubenssätze</h3>
                      <p className="text-gray-600 bg-purple-50 p-3 rounded-lg">{contact.beliefs}</p>
                    </div>
                  )}
                  {contact.redFlags && (
                    <div>
                      <h3 className="font-medium text-red-700 mb-2">Red Flags</h3>
                      <p className="text-gray-600 bg-red-50 p-3 rounded-lg">{contact.redFlags}</p>
                    </div>
                  )}
                  {contact.motivations && (
                    <div>
                      <h3 className="font-medium text-green-700 mb-2">Motivationen</h3>
                      <p className="text-gray-600 bg-green-50 p-3 rounded-lg">{contact.motivations}</p>
                    </div>
                  )}
                  {contact.fears && (
                    <div>
                      <h3 className="font-medium text-orange-700 mb-2">Ängste</h3>
                      <p className="text-gray-600 bg-orange-50 p-3 rounded-lg">{contact.fears}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar Info */}
        <div className="space-y-6">
          {/* Kontaktinformationen */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Kontaktinformationen</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Kennengelernt</p>
                  <p className="font-medium">
                    {contact.metDate ? new Date(contact.metDate).toLocaleDateString('de-DE') : 'Nicht angegeben'}
                  </p>
                  {contact.metLocation && (
                    <p className="text-sm text-gray-500">{contact.metLocation}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <SafeIcon icon={FiMessageCircle} className="w-4 h-4 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Letzter Kontakt</p>
                  <p className="font-medium">
                    {new Date(contact.lastContact).toLocaleDateString('de-DE')}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Verbindungstyp</p>
                <p className="font-medium capitalize">{contact.connectionType}</p>
              </div>
              <div className="flex items-center">
                <SafeIcon icon={FiUsers} className="w-4 h-4 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Beziehungen</p>
                  <p className="font-medium">
                    {relationships.length} Verbindung{relationships.length !== 1 ? 'en' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interaktionen */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Letzte Interaktionen</h2>
            {contact.interactions && contact.interactions.length > 0 ? (
              <div className="space-y-3">
                {contact.interactions.slice(-5).reverse().map((interaction) => (
                  <div key={interaction.id} className="border-l-2 border-blue-200 pl-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium capitalize">{interaction.type}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(interaction.date).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{interaction.content}</p>
                    {interaction.emotion && (
                      <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                        interaction.emotion === 'positiv' ? 'bg-green-100 text-green-800' :
                        interaction.emotion === 'negativ' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {interaction.emotion}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Noch keine Interaktionen aufgezeichnet</p>
            )}
          </div>
        </div>
      </div>

      {/* Interaction Form Modal */}
      {showInteractionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Neue Interaktion</h2>
            <form onSubmit={handleAddInteraction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Typ</label>
                <select
                  value={interactionData.type}
                  onChange={(e) => setInteractionData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="gespräch">Gespräch</option>
                  <option value="nachricht">Nachricht</option>
                  <option value="treffen">Treffen</option>
                  <option value="anruf">Anruf</option>
                  <option value="konflikt">Konflikt</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inhalt</label>
                <textarea
                  value={interactionData.content}
                  onChange={(e) => setInteractionData(prev => ({ ...prev, content: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Was ist passiert?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emotion</label>
                <select
                  value={interactionData.emotion}
                  onChange={(e) => setInteractionData(prev => ({ ...prev, emotion: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="positiv">Positiv</option>
                  <option value="neutral">Neutral</option>
                  <option value="negativ">Negativ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Was habe ich gelernt?</label>
                <textarea
                  value={interactionData.learned}
                  onChange={(e) => setInteractionData(prev => ({ ...prev, learned: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Erkenntnisse aus dieser Interaktion..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowInteractionForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Speichern
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Relationship Form Modal */}
      {showRelationshipForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Neue Beziehung</h2>
            <form onSubmit={handleAddRelationship} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kontakt</label>
                <select
                  value={relationshipData.targetId}
                  onChange={(e) => setRelationshipData(prev => ({ ...prev, targetId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Kontakt auswählen...</option>
                  {contacts
                    .filter(c => c.id !== id)
                    .map(contact => (
                      <option key={contact.id} value={contact.id}>{contact.name}</option>
                    ))
                  }
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beziehungstyp</label>
                <select
                  value={relationshipData.type}
                  onChange={(e) => setRelationshipData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="positiv">Positiv</option>
                  <option value="neutral">Neutral</option>
                  <option value="negativ">Negativ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notizen</label>
                <textarea
                  value={relationshipData.notes}
                  onChange={(e) => setRelationshipData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Beschreibung der Beziehung..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRelationshipForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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

export default ContactDetail;