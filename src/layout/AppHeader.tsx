import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { ThemeToggleButton } from "../app/components/common/ThemeToggleButton";
import NotificationDropdown from "../app/components/header/NotificationDropdown";
import UserDropdown from "../app/components/header/UserDropdown";
import { useSidebar } from "../app/context/SidebarContext";

const AppHeader: React.FC = () => {
  const [isLangOpen, setIsLangOpen] = useState(false); // Removed unused isApplicationMenuOpen state

  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const { toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsLangOpen(false);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        {/* LEFT SIDE */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
          >
            ☰
          </button>

          <Link to="/" className="lg:hidden">
            <img src="./images/logo/logo.svg" alt="Logo" />
          </Link>

          {/* SEARCH */}
          <div className="hidden lg:block">
            <input
              ref={inputRef}
              type="text"
              placeholder={t('search')}
              className="h-11 w-[350px] rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-800 dark:bg-gray-900"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-end w-full gap-3 px-5 py-4 lg:flex lg:px-0">
          {/* 🌐 Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
            >
              🌐
              {i18n.language === "ar" ? "Arabic" : "English"}
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
                <button
                  onClick={() => changeLanguage("en")}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  English
                </button>
                <button
                  onClick={() => changeLanguage("ar")}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Arabic
                </button>
              </div>
            )}
          </div>

          <ThemeToggleButton />
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;