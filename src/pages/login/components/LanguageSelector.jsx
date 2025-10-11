import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    {
      code: 'fr',
      name: 'Français',
      flag: '🇫🇷',
      description: 'Langue officielle'
    },
    {
      code: 'en',
      name: 'English',
      flag: '🇬🇧',
      description: 'International'
    }
  ];

  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('taxcalc_language', languageCode);
    setIsOpen(false);
    
    // In a real app, this would trigger a language change
    console.log(`Language changed to: ${languageCode}`);
  };

  const currentLang = languages?.find(lang => lang?.code === currentLanguage);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="font-body text-sm">{currentLang?.name}</span>
        <Icon name="ChevronDown" size={14} />
      </Button>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-50">
            <div className="p-2">
              {languages?.map((language) => (
                <button
                  key={language?.code}
                  onClick={() => handleLanguageChange(language?.code)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    currentLanguage === language?.code
                      ? 'bg-primary text-primary-foreground'
                      : 'text-popover-foreground hover:bg-muted'
                  }`}
                >
                  <span className="text-lg">{language?.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-sm">
                      {language?.name}
                    </p>
                    <p className="text-xs opacity-70">
                      {language?.description}
                    </p>
                  </div>
                  {currentLanguage === language?.code && (
                    <Icon name="Check" size={16} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;