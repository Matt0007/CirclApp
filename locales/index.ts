import en from "./en";
import fr from "./fr";

export type Locale = "en" | "fr";

export const locales = {
  en,
  fr,
};

export type TranslationKeys = keyof typeof en;

export default locales;
