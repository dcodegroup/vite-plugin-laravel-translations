/**
 * ------------------------------------------------
 *  # Import: Dependencies
 * ------------------------------------------------
 */
import { determineLaravelVersion, getLangDir } from "./laravel";
import { buildTranslations } from "./loader";
import type { TranslationConfiguration } from "../types";
import type { HmrContext, UserConfig } from "vite";

/**
 * ------------------------------------------------
 *  # Setup: Main Function
 * ------------------------------------------------
 */
export default async function laravelTranslations(pluginConfiguration: TranslationConfiguration = {}) {
  // # Define: Default Configurations
  const defaultConfigurations: TranslationConfiguration = {
    namespace: false,
    includeJson: false,
    assertJsonImport: false,
    absoluteLanguageDirectory: null,
    useGlobalVar: false,
  };

  // # Retrieve: Laravel Path (Absolute)
  const absPathForLangDir = pluginConfiguration.absoluteLanguageDirectory || getLangDir(determineLaravelVersion());

  return {
    // # Define: Plugin Name for Vite
    name: "laravelTranslations",

    // # Plugin: Configuration Hook (like construct)
    async config() {
      // # Merge: Configrations
      pluginConfiguration = Object.assign({}, defaultConfigurations, pluginConfiguration);

      // # Assign: Translations as LARAVEL_TRANSLATIONS/import.meta.env.VITE_LARAVEL_TRANSLATIONS
      const translationsVar = pluginConfiguration.useGlobalVar ? "LARAVEL_TRANSLATIONS" : "import.meta.env.VITE_LARAVEL_TRANSLATIONS";
      return {
        define: {
          [translationsVar]: await buildTranslations(absPathForLangDir, pluginConfiguration),
        },
      };
    },
    handleHotUpdate(context: HmrContext) {
      // # Determine: Regex to match based on configurations
      const fileMatchRegex = pluginConfiguration.includeJson ? /lang\/.*\.(?:php|json)$/ : /lang\/.*\.php$/;

      // # Trigger: Server Restart to pick up changes on file match
      if (fileMatchRegex.test(context.file)) {
        context.server.restart();
      }
    },
  };
}
