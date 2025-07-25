import React, { createContext, useContext, useState, useEffect } from 'react';

const ContactContext = createContext();

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
};

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [relationships, setRelationships] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('crm-contacts');
    const savedJournal = localStorage.getItem('crm-journal');
    const savedRelationships = localStorage.getItem('crm-relationships');
    
    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts));
      } catch (e) {
        console.error("Failed to parse contacts data:", e);
        setContacts([]);
      }
    }
    
    if (savedJournal) {
      try {
        setJournalEntries(JSON.parse(savedJournal));
      } catch (e) {
        console.error("Failed to parse journal data:", e);
        setJournalEntries([]);
      }
    }

    if (savedRelationships) {
      try {
        setRelationships(JSON.parse(savedRelationships));
      } catch (e) {
        console.error("Failed to parse relationships data:", e);
        setRelationships([]);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('crm-contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('crm-journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('crm-relationships', JSON.stringify(relationships));
  }, [relationships]);

  const addContact = (contact) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString(),
      interactions: []
    };
    setContacts(prev => [...prev, newContact]);
    return newContact.id;
  };

  const updateContact = (id, updates) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    ));
  };

  const deleteContact = (id) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
    // Also delete any relationships involving this contact
    setRelationships(prev => prev.filter(rel => 
      rel.sourceId !== id && rel.targetId !== id
    ));
  };

  const addInteraction = (contactId, interaction) => {
    const newInteraction = {
      ...interaction,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { 
            ...contact, 
            interactions: [...(contact.interactions || []), newInteraction],
            lastContact: new Date().toISOString()
          }
        : contact
    ));
  };

  const addJournalEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  // Relationship management functions
  const addRelationship = (sourceId, targetId, type = 'neutral', notes = '') => {
    // Prevent duplicate relationships
    const existingRelationship = relationships.find(
      rel => (rel.sourceId === sourceId && rel.targetId === targetId) || 
             (rel.sourceId === targetId && rel.targetId === sourceId)
    );

    if (existingRelationship) {
      // Update existing relationship
      setRelationships(prev => prev.map(rel => 
        (rel.sourceId === sourceId && rel.targetId === targetId) || 
        (rel.sourceId === targetId && rel.targetId === sourceId)
          ? { ...rel, type, notes, lastUpdated: new Date().toISOString() }
          : rel
      ));
    } else {
      // Create new relationship
      const newRelationship = {
        id: Date.now().toString(),
        sourceId,
        targetId,
        type,
        notes,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      setRelationships(prev => [...prev, newRelationship]);
    }
  };

  const updateRelationship = (relationshipId, updates) => {
    setRelationships(prev => prev.map(rel => 
      rel.id === relationshipId 
        ? { ...rel, ...updates, lastUpdated: new Date().toISOString() } 
        : rel
    ));
  };

  const deleteRelationship = (relationshipId) => {
    setRelationships(prev => prev.filter(rel => rel.id !== relationshipId));
  };

  const getRelationshipsBetween = (sourceId, targetId) => {
    return relationships.filter(rel => 
      (rel.sourceId === sourceId && rel.targetId === targetId) || 
      (rel.sourceId === targetId && rel.targetId === sourceId)
    );
  };

  const getRelationshipsForContact = (contactId) => {
    return relationships.filter(rel => 
      rel.sourceId === contactId || rel.targetId === contactId
    );
  };

  const value = {
    contacts,
    journalEntries,
    relationships,
    addContact,
    updateContact,
    deleteContact,
    addInteraction,
    addJournalEntry,
    addRelationship,
    updateRelationship,
    deleteRelationship,
    getRelationshipsBetween,
    getRelationshipsForContact
  };

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
};