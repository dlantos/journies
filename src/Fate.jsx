import React from 'react';

const Fate = ({ card }) => {
  return (
    <div>
      <h2>Fate for {card.definition}</h2>
      <p>{card.fate}</p>
    </div>
  );
};

export default Fate;
