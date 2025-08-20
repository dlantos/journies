import React from 'react';

const Journey = ({ card }) => {
  return (
    <div>
      <h2>Journey for {card.definition}</h2>
      <p>{card.journey}</p>
    </div>
  );
};

export default Journey;
