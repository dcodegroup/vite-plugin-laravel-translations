"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = laravelTranslations;
/**
 * ##########################################
 * #			     IMPORTS	 			#
 * ##########################################
 */
const laravel_js_1 = require("./laravel.js");
const loader_js_1 = require("./loader.js");
/**
 * ##########################################
 * #			  MAIN FUNCTION 			#
 * ##########################################
 */
async function laravelTranslations(pluginConfiguration = {}) {
    // # Define: Default Configurations
    const defaultConfigurations = {
        namespace: false,
        includeJson: false,
        absoluteLanguageDirectory: null
    };
    // # Retrieve: Laravel Version
    const laravelVersion = await (0, laravel_js_1.determineLaravelVersion)();
    // # Retrieve: Laravel Path (Absolute)
    const absPathForLangDir = pluginConfiguration.absoluteLanguageDirectory || (0, laravel_js_1.getLangDir)(laravelVersion);
    return {
        // # Define: Plugin Name for Vite
        name: 'laravelTranslations',
        // # Plugin: Configuration Hook (like construct)
        async config() {
            // # Merge: Configrations
            pluginConfiguration = Object.assign({}, defaultConfigurations, pluginConfiguration);
            // # Build: Translations
            const translations = await (0, loader_js_1.buildTranslations)(absPathForLangDir, pluginConfiguration);
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
