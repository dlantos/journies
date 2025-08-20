// src/CardGrid.jsx
import React, { useState, useEffect } from 'react';
import Card from './Card';
import _ from 'lodash';

const CardGrid = ({ language, toggleLanguage }) => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [contentType, setContentType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      try {
        setLoading(true);
        const cardPromises = Array.from({ length: 42 }, async (_, i) => {
          const id = i + 1;
          try {
            const [definition, journey, fate] = await Promise.all([
              fetch(`/content/${language.code}/${id}-definition.txt`).then(res => {
                if (!res.ok) throw new Error(`Failed to load definition: ${res.statusText}`);
                return res.text();
              }),
              fetch(`/content/${language.code}/${id}-journey.txt`).then(res => {
                if (!res.ok) throw new Error(`Failed to load journey: ${res.statusText}`);
                return res.text();
              }),
              fetch(`/content/${language.code}/${id}-fate.txt`).then(res => {
                if (!res.ok) throw new Error(`Failed to load fate: ${res.statusText}`);
                return res.text();
              })
            ]);
            return { id, definition, journey, fate, flipped: false };
          } catch (error) {
            console.error(`Error loading card ${id} in ${language.code}:`, error);
            // Fallback to English if translation is missing
            try {
              const [definition, journey, fate] = await Promise.all([
                fetch(`/content/en/${id}-definition.txt`).then(res => {
                  if (!res.ok) throw new Error('Fallback failed');
                  return res.text();
                }),
                fetch(`/content/en/${id}-journey.txt`).then(res => {
                  if (!res.ok) throw new Error('Fallback failed');
                  return res.text();
                }),
                fetch(`/content/en/${id}-fate.txt`).then(res => {
                  if (!res.ok) throw new Error('Fallback failed');
                  return res.text();
                })
              ]);
              return { id, definition, journey, fate, flipped: false };
            } catch (fallbackError) {
              console.error(`Fallback also failed for card ${id}:`, fallbackError);
              return {
                id,
                definition: `Definition for card ${id} not found`,
                journey: `Journey for card ${id} not found`,
                fate: `Fate for card ${id} not found`,
                flipped: false
              };
            }
          }
        });
        const loadedCards = await Promise.all(cardPromises);
        setCards(_.shuffle(loadedCards));
      } catch (error) {
        console.error("Error loading cards:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCards();
  }, [language]);

  const handleReset = () => {
    // Create new card objects with flipped set to false
    const resetCards = cards.map(card => ({
      ...card,
      flipped: false
    }));
    // Reshuffle the cards
    const shuffledCards = _.shuffle(resetCards);
    setCards(shuffledCards);
    // Also close any open modal
    setSelectedCard(null);
    setContentType(null);
  };

  const handleCardClick = (card, type = null) => {
    // Update the flipped state of the clicked card
    const updatedCards = cards.map(c =>
      c.id === card.id ? { ...c, flipped: true } : c
    );
    setCards(updatedCards);

    setSelectedCard(card);
    setContentType(type);
  };

  const closeModal = () => {
    setSelectedCard(null);
    setContentType(null);
  };

  const getNextLanguage = () => {
    const languages = ['en', 'he'];
    const currentIndex = languages.indexOf(language.code);
    const nextIndex = (currentIndex + 1) % languages.length;
    return languages[nextIndex];
  };

  const getLanguageName = (langCode) => {
    const names = {
      en: 'English',
      he: 'עברית'
    };
    return names[langCode] || langCode;
  };

  if (loading) return <div className="loading">Loading cards...</div>;

  return (
    <div className="card-game-container">
      <div className="language-toggle-container">
        <button className="language-toggle-btn" onClick={toggleLanguage}>
          Switch to {getLanguageName(getNextLanguage())}
        </button>
        <button className="reset-btn" onClick={handleReset}>Reset</button>
      </div>
      <div className="card-grid">
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            onClick={handleCardClick}
            flipped={card.flipped} // Pass flipped state to Card component
          />
        ))}
      </div>
      {selectedCard && (
        <div className="card-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>×</button>
            {contentType === 'journey' ? (
              <div className="journey-content">
                <h2>Journey</h2>
                <p>{selectedCard.journey}</p>
              </div>
            ) : contentType === 'fate' ? (
              <div className="fate-content">
                <h2>Fate</h2>
                <p>{selectedCard.fate}</p>
              </div>
            ) : (
              <div className="card-definition">
                <h2>{selectedCard.definition}</h2>
                <div className="modal-actions">
                  <button onClick={() => handleCardClick(selectedCard, 'journey')}>Journey</button>
                  <button onClick={() => handleCardClick(selectedCard, 'fate')}>Fate</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardGrid;
