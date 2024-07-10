/**
 * ##########################################
 * #			     IMPORTS	 			#
 * ##########################################
 */
import { determineLaravelVersion, getLangDir } from './laravel';
import { buildTranslations } from './loader';
import { TranslationConfiguration } from '../types';
import type { HmrContext } from 'vite';

/**
 * ##########################################
 * #			  MAIN FUNCTION 			#
 * ##########################################
 */
export default async function laravelTranslations(pluginConfiguration: TranslationConfiguration = {}) {
  // # Define: Default Configurations
  const defaultConfigurations: TranslationConfiguration = {
    namespace: false,
    includeJson: false,
    absoluteLanguageDirectory: null
  };

  // # Retrieve: Laravel Version
  const laravelVersion = await determineLaravelVersion();

  // # Retrieve: Laravel Path (Absolute)
  const absPathForLangDir = pluginConfiguration.absoluteLanguageDirectory || getLangDir(laravelVersion);

  return {
    // # Define: Plugin Name for Vite
    name: 'laravelTranslations',

    // # Plugin: Configuration Hook (like construct)
    async config() {
      // # Merge: Configrations
      pluginConfiguration = Object.assign({}, defaultConfigurations, pluginConfiguration);

      // # Build: Translations
      const translations = await buildTranslations(absPathForLangDir, pluginConfiguration);

      // # Define: Make available as global variable
      return {
        define: {
          LARAVEL_TRANSLATIONS: translations
        }
      };
    },
    handleHotUpdate(context: HmrContext) {
      // # Determine: Regex to match based on configurations
      const fileMatchRegex = pluginConfiguration.includeJson ? /lang\/.*\.(?:php|json)$/ : /lang\/.*\.php$/;

      // # Check: Match Regex
      if (fileMatchRegex.test(context.file)) {
        // # Trigger: Server Restart to pick up changes
        context.server.restart();
      }
    }
  };
}
