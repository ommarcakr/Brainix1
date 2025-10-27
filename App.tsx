

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatView from './components/ChatView';
import ImageGeneratorView from './components/ImageGeneratorView';
import CodeGeneratorView from './components/CodeGeneratorView';
import PlanView from './components/PlanView';
import SearchView from './components/SearchView';
import ContextualQAView from './components/ContextualQAView';
import SettingsModal from './components/SettingsModal';
// FIX: Add .tsx extension to component import.
import UpgradeModal from './components/UpgradeModal.tsx';
// FIX: Add .ts extension to hook import.
import { useSubscription } from './hooks/useSubscription.ts';
import { AppMode, Language, Theme } from './types';
// FIX: Add .ts extension to constants import.
import { TRANSLATIONS } from './constants.ts';
import { WhatsAppIcon } from './components/icons';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('chat');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('system');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  
  const subscription = useSubscription(() => setIsUpgradeModalOpen(true));
  const t = TRANSLATIONS[language];


  useEffect(() => {
    const applyTheme = () => {
      const root = window.document.documentElement;
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.classList.toggle('dark', isDark);
    };

    applyTheme();
    document.dir = language === 'ar' ? 'rtl' : 'ltr';

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, language]);


  const renderContent = () => {
    const props = { language, checkAccess: subscription.checkAccess };
    switch (mode) {
      case 'chat':
        return <ChatView {...props} />;
      case 'image':
        return <ImageGeneratorView {...props} />;
      case 'code':
        return <CodeGeneratorView {...props} />;
      case 'plan':
        return <PlanView {...props} />;
      case 'search':
        return <SearchView {...props} />;
      case 'contextual':
        return <ContextualQAView {...props} />;
      default:
        return <ChatView {...props} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300`}>
          <Sidebar
              mode={mode}
              setMode={setMode}
              onSettingsClick={() => setIsSettingsOpen(true)}
              language={language}
          />
      </div>

      <div className="flex-1 flex flex-col">
        <Header mode={mode} language={language} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
      />
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        language={language}
        subscription={subscription}
      />

      <a
        href="https://wa.me/201050789035"
        target="_blank"
        rel="noopener noreferrer"
        title={t.customerSupport}
        className={`fixed bottom-6 ${language === 'ar' ? 'left-6' : 'right-6'} bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50`}
      >
        <WhatsAppIcon className="w-8 h-8" />
      </a>
    </div>
  );
};

export default App;