"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ##########################################
 * #			     IMPORTS	 			#
 * ##########################################
 */
const laravel_1 = require("./laravel");
const loader_1 = require("./loader");
/**
 * ##########################################
 * #			  MAIN FUNCTION 			#
 * ##########################################
 */
async function laravelTranslations(pluginConfiguration = {}) {
    // # Define: Default Configurations
    const defaultConfigurations = {
        namespace: false,
        includeJson: false
    };
    // # Retrieve: Laravel Version
    const laravelVersion = await (0, laravel_1.determineLaravelVersion)();
    // # Retrieve: Laravel Path (Absolute)
    const absPathForLangDir = (0, laravel_1.getLangDir)(laravelVersion);
    return {
        // # Define: Plugin Name for Vite
        name: 'laravelTranslations',
        // # Plugin: Configuration Hook (like construct)
        async config() {
            // # Merge: Configrations
            pluginConfiguration = Object.assign({}, defaultConfigurations, pluginConfiguration);
            // # Build: Translations
            const translations = await (0, loader_1.buildTranslations)(absPathForLangDir, pluginConfiguration);
            // # Define: Make available as global variable
            return {
                define: {
                    LARAVEL_TRANSLATIONS: translations
                }
            };
        },
        handleHotUpdate(context) {
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
exports.default = laravelTranslations;
//# sourceMappingURL=vite.js.map