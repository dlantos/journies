// src/App.jsx
import React, { useState, useEffect } from 'react';
import Introduction from './Introduction';
import CardGrid from './CardGrid';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const languages = [
    { code: 'en', name: 'English', dir: 'ltr' },
    { code: 'he', name: 'עברית', dir: 'rtl' } // Added Hebrew with RTL direction

  ];
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const currentLanguage = languages[currentLanguageIndex];

  const toggleLanguage = () => {
    setCurrentLanguageIndex((prevIndex) => (prevIndex + 1) % languages.length);
  };

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.setAttribute('dir', currentLanguage.dir);
    document.documentElement.setAttribute('lang', currentLanguage.code);
  }, [currentLanguage]);

  return (
    <div>
      {!gameStarted ? (
        <Introduction
          onStart={() => setGameStarted(true)}
          setLanguage={(langCode) => {
            const index = languages.findIndex(lang => lang.code === langCode);
            if (index !== -1) setCurrentLanguageIndex(index);
          }}
          currentLanguage={currentLanguage}
        />
      ) : (
        <CardGrid
          language={currentLanguage}
          toggleLanguage={toggleLanguage}
        />
      )}
    </div>
  );
};

export default App;
