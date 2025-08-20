// src/Introduction.jsx
import React from 'react';

const Introduction = ({ onStart, setLanguage, currentLanguage }) => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'he', name: 'עברית' } // Added Hebrew

  ];

  return (
    <div className="introduction">
      <h1>Welcome to the Card Game!</h1>
      <p>Please read the instructions carefully before starting.</p>

      <div className="language-selector">
        <h3>Select Language:</h3>
        <div className="language-options">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`language-btn ${currentLanguage.code === lang.code ? 'active' : ''}`}
              onClick={() => setLanguage(lang.code)}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      <button className="start-btn" onClick={onStart}>Start Game</button>
    </div>
  );
};

export default Introduction;
