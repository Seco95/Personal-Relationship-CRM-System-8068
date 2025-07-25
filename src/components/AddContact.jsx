import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../context/ContactContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSave, FiArrowLeft } = FiIcons;

const AddContact = () => {
  const navigate = useNavigate();
  const { addContact } = useContacts();
  
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    category: 'freund',
    connectionType: 'emotional',
    relationshipStatus: 'aktiv',
    metDate: '',
    metLocation: '',
    personalNotes: '',
    strengths: '',
    weaknesses: '',
    interests: '',
    triggerPoints: '',
    quotes: '',
    trustLevel: 3,
    importance: 3,
    potential: 'mittel',
    netWorth: '',
    energyBalance: 'neutral',
    loyaltyTendency: 'neutral',
    behaviorPatterns: '',
    beliefs: '',
    redFlags: '',
    motivations: '',
    fears: '',
    conflictTriggers: ''
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const contactId = addContact(formData);
    navigate(`/contacts/${contactId}`);
  };

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Neuer Kontakt</h1>
          <p className="text-gray-600">Füge eine neue Person zu deinem CRM hinzu</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Grunddaten */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Grunddaten</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Spitzname</label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="freund">Freund</option>
                <option value="familie">Familie</option>
                <option value="kunde">Kunde</option>
                <option value="mentor">Mentor</option>
                <option value="feind">Feind</option>
                <option value="neider">Neider</option>
                <option value="rivale">Rivale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verbindungstyp</label>
              <select
                name="connectionType"
                value={formData.connectionType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="emotional">Emotional</option>
                <option value="geschäftlich">Geschäftlich</option>
                <option value="intellektuell">Intellektuell</option>
                <option value="familiär">Familiär</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beziehungsstatus</label>
              <select
                name="relationshipStatus"
                value={formData.relationshipStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="aktiv">Aktiv</option>
                <option value="passiv">Passiv</option>
                <option value="unterbrochen">Unterbrochen</option>
                <option value="toxisch">Toxisch</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kennenlern-Datum</label>
              <input
                type="date"
                name="metDate"
                value={formData.metDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Kennenlern-Ort</label>
              <input
                type="text"
                name="metLocation"
                value={formData.metLocation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Bewertung */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bewertung</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vertrauenslevel (1-5): {formData.trustLevel}
              </label>
              <input
                type="range"
                name="trustLevel"
                min="1"
                max="5"
                value={formData.trustLevel}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wichtigkeit (1-5): {formData.importance}
              </label>
              <input
                type="range"
                name="importance"
                min="1"
                max="5"
                value={formData.importance}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Potenzial</label>
              <select
                name="potential"
                value={formData.potential}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="niedrig">Niedrig</option>
                <option value="mittel">Mittel</option>
                <option value="hoch">Hoch</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Energie-Bilanz</label>
              <select
                name="energyBalance"
                value={formData.energyBalance}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="energieraubend">Energieraubend</option>
                <option value="neutral">Neutral</option>
                <option value="energiespendend">Energiespendend</option>
              </select>
            </div>
          </div>
        </div>

        {/* Persönliche Notizen */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Persönliche Notizen</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allgemeine Notizen</label>
              <textarea
                name="personalNotes"
                value={formData.personalNotes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stärken</label>
                <textarea
                  name="strengths"
                  value={formData.strengths}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schwächen</label>
                <textarea
                  name="weaknesses"
                  value={formData.weaknesses}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interessen</label>
                <textarea
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Triggerpunkte</label>
                <textarea
                  name="triggerPoints"
                  value={formData.triggerPoints}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Psychogramm */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Psychogramm</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verhaltensmuster</label>
              <textarea
                name="behaviorPatterns"
                value={formData.behaviorPatterns}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Wie reagiert die Person in Konflikten, Gruppen, unter Druck?"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Glaubenssätze</label>
                <textarea
                  name="beliefs"
                  value={formData.beliefs}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Red Flags</label>
                <textarea
                  name="redFlags"
                  value={formData.redFlags}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Motivationen</label>
                <textarea
                  name="motivations"
                  value={formData.motivations}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ängste</label>
                <textarea
                  name="fears"
                  value={formData.fears}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
            Kontakt speichern
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddContact;