/**
 * ##########################################
 * #			     IMPORTS	 			#
 * ##########################################
 */
import { determineLaravelVersion, getLangDir } from './laravel';
import { buildTranslations } from './loader';
import { TranslationConfiguration } from '../types/index';
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
    includeJson: false
  };

  // # Retrieve: Laravel Version
  const laravelVersion = await determineLaravelVersion();

  // # Retrieve: Laravel Path (Absolute)
  const absPathForLangDir = getLangDir(laravelVersion);

  return {
    // # Define: Plugin Name for Vite
    name: 'laravelTranslations',

    // # Plugin: Configuration Hook (like construct)
    config() {
      // # Merge: Configrations
      pluginConfiguration = Object.assign({}, defaultConfigurations, pluginConfiguration);

      // # Build: Translations
      const translations = buildTranslations(absPathForLangDir, pluginConfiguration);

      // # Define: Make available as global variable
      return {
        define: {
          LARAVEL_TRANSLATIONS: translations
        }
      };
    },
    handleHotUpdate(context: HmrContext) {
      // # Determine: Regex to match based on configurations
      const fileMatchRegex = pluginConfiguration.includeJson ? /lang\/.*\.php$/ : /lang\/.*\.php$/;

      // # Check: Match Regex
      if (fileMatchRegex.test(context.file)) {
        // # Trigger: Server Restart to pick up changes
        context.server.restart();
      }
    }
  };
}
