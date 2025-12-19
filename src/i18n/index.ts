import i18n from "i18next";
import { initReactI18next } from "react-i18next";
 
import en from "./locales/en/translation.json";
import ar from "./locales/ar/translation.json";
 
const languageModel = {
  defaultLanguage: "en",
  fallbackLanguage: "en",
};
 
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
 
    lng: languageModel.defaultLanguage,
    fallbackLng: languageModel.fallbackLanguage,
 
    interpolation: {
      escapeValue: false,
    },
  });
 
export default i18n;
 
 