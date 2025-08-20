// src/Card.jsx
import React from 'react';

const Card = ({ card, onClick, flipped }) => {
  const handleClick = () => {
    // Only trigger onClick if card isn't already flipped
    if (!flipped) {
      onClick(card);
    }
  };

  const handleJourneyClick = (e) => {
    e.stopPropagation();
    onClick(card, 'journey');
  };

  const handleFateClick = (e) => {
    e.stopPropagation();
    onClick(card, 'fate');
  };

  return (
    <div className={`card ${flipped ? 'flipped' : ''}`} onClick={handleClick}>
      <div className="card-front">
        <div className="card-back-design"></div>
      </div>
      <div className="card-back">
        <h2>{card.definition}</h2>
        <div className="card-actions">
          <button onClick={handleJourneyClick}>Journey</button>
          <button onClick={handleFateClick}>Fate</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
